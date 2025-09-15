/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import Joi from "joi";

const transactionSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  transactionType: Joi.string().valid("IN", "OUT").required(),
  weight: Joi.number().precision(2).positive().required(),
  hall: Joi.string().valid("A", "B", "C", "D", "E", "F", "G", "H").required(),
  basketNumbers: Joi.array().items(Joi.string()).unique().min(1).required(),
  transactionDate: Joi.date().required(),
});

export const POST = async (req: NextRequest): Promise<Response> => {
  const client = await getClient();

  try {
    if (!client) {
      return Response.json({ message: "DB connection error" }, { status: 500 });
    }

    const { isLogin } = await getUser();
    if (!isLogin) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { error } = transactionSchema.validate(body, { abortEarly: false });
    if (error) {
      return Response.json(
        { message: "Params not valid", error: error.details },
        { status: 400 }
      );
    }

    if (body.transactionType === "OUT") {
      const balanceQuery = `
    SELECT 
      COALESCE(SUM(CASE WHEN TransactionType = 'IN' THEN Weight
                        WHEN TransactionType = 'OUT' THEN -Weight END), 0) AS balance
    FROM Transactions
    WHERE CustomerID = $1;
  `;
      const { rows: balanceRows } = await client.query(balanceQuery, [
        body.customerId,
      ]);
      const balance = parseFloat(balanceRows[0].balance);

      if (body.weight > balance) {
        await client.query("ROLLBACK");
        return Response.json(
          { message: "Insufficient balance: total OUT cannot exceed total IN" },
          { status: 400 }
        );
      }
    }

    await client.query("BEGIN");

    // بررسی وضعیت سبدها
    const checkQuery = `
      WITH LastStatus AS (
        SELECT
          tb.BasketCode,
          t.CustomerID,
          t.TransactionType,
          ROW_NUMBER() OVER (PARTITION BY t.Hall, tb.BasketCode ORDER BY t.TransactionDate DESC, t.TransactionID DESC) AS rn
        FROM TransactionBaskets tb
        JOIN Transactions t ON t.TransactionID = tb.TransactionID
        WHERE tb.BasketCode = ANY($1::text[]) AND t.Hall = $2
      )
      SELECT * FROM LastStatus WHERE rn = 1;
    `;

    const { rows: lastStatuses } = await client.query(checkQuery, [
      body.basketNumbers,
      body.hall,
    ]);

    if (body.transactionType === "IN") {
      const occupied = lastStatuses.find((s) => s.transactiontype === "IN");
      if (occupied) {
        await client.query("ROLLBACK");
        return Response.json(
          { message: `Basket ${occupied.basketcode} is already occupied` },
          { status: 409 }
        );
      }
    } else if (body.transactionType === "OUT") {
      for (const b of body.basketNumbers) {
        const status = lastStatuses.find((s) => s.basketcode === b);
        if (!status || status.transactiontype !== "IN") {
          await client.query("ROLLBACK");
          return Response.json(
            { message: `Basket ${b} is not occupied` },
            { status: 400 }
          );
        }
        if (status.customerid !== body.customerId) {
          await client.query("ROLLBACK");
          return Response.json(
            { message: `Basket ${b} belongs to another customer` },
            { status: 403 }
          );
        }
      }
    }

    const insertTransaction = `
      INSERT INTO Transactions (CustomerID, TransactionType, TransactionDate, Weight, Hall)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING TransactionID;
    `;
    const { rows: txRows } = await client.query(insertTransaction, [
      body.customerId,
      body.transactionType,
      body.transactionDate,
      body.weight,
      body.hall,
    ]);

    const transactionId = txRows[0].transactionid;

    const insertBasket = `
      INSERT INTO TransactionBaskets (TransactionID, BasketCode)
      VALUES ($1, $2);
    `;
    for (const basket of body.basketNumbers) {
      await client.query(insertBasket, [transactionId, basket]);
    }

    await client.query("COMMIT");

    return Response.json(
      {
        message: "Transaction created successfully",
        data: { transactionId, ...body },
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (client) await client.query("ROLLBACK");

    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
