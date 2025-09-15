/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import Joi from "joi";

const updateCustomerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  nationalCode: Joi.string().length(10).pattern(/^\d+$/),
  phone: Joi.string().pattern(/^09\d{9}$/),
  productName: Joi.string(),
});

type Params = { params: Promise<{ id: string }> };

export const PUT = async (
  req: NextRequest,
  { params }: Params
): Promise<Response> => {
  try {
    const client = await getClient();
    if (!client) {
      return Response.json({ message: "DB connection error" }, { status: 500 });
    }

    const { isLogin } = await getUser();
    if (!isLogin) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { error } = updateCustomerSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return Response.json(
        { message: "مقادیر نامعتبر است", error: error.details },
        { status: 400 }
      );
    }

    const customerId = parseInt((await params).id, 10);

    if (isNaN(customerId)) {
      return Response.json(
        { message: "مقادیر نامعتبر است (کد مشتری)" },
        { status: 400 }
      );
    }

    // بررسی وجود مشتری
    const checkCustomer = await client.query(
      "SELECT * FROM Customers WHERE CustomerID = $1",
      [customerId]
    );
    if (checkCustomer.rowCount === 0) {
      return Response.json({ message: "مشتری پیدا نشد" }, { status: 404 });
    }

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of [
      "firstName",
      "lastName",
      "nationalCode",
      "phone",
      "productName",
    ]) {
      if (body[key] !== undefined) {
        fields.push(
          `${
            key === "nationalCode"
              ? "NationalCode"
              : key === "firstName"
              ? "FirstName"
              : key === "lastName"
              ? "LastName"
              : key === "phone"
              ? "Phone"
              : "ProductName"
          } = $${idx}`
        );
        values.push(body[key]);
        idx++;
      }
    }

    if (fields.length === 0) {
      return Response.json({ message: "مقادیر نامعتبر" }, { status: 400 });
    }

    values.push(customerId);

    const updateQuery = `
      UPDATE Customers
      SET ${fields.join(", ")}
      WHERE CustomerID = $${idx}
      RETURNING *;
    `;

    let updated;
    try {
      const result = await client.query(updateQuery, values);
      updated = result.rows[0];
    } catch (err: any) {
      if (err?.code === "23505") {
        return Response.json(
          { message: "این کاربر قبلا اضافه شده" },
          { status: 409 }
        );
      }
      throw err;
    }

    return Response.json(
      { message: "Customer updated successfully", data: updated },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: NextRequest,
  { params }: Params
): Promise<Response> => {
  try {
    const client = await getClient();
    if (!client)
      return Response.json({ message: "DB connection error" }, { status: 500 });

    const { isLogin } = await getUser();
    if (!isLogin)
      return Response.json({ message: "Unauthorized" }, { status: 403 });

    const customerId = parseInt((await params).id, 10);
    if (isNaN(customerId))
      return Response.json({ message: "Invalid customer ID" }, { status: 400 });

    const { rows: customerRows } = await client.query(
      "SELECT * FROM Customers WHERE CustomerID = $1",
      [customerId]
    );
    if (customerRows.length === 0)
      return Response.json({ message: "Customer not found" }, { status: 404 });
    const customer = customerRows[0];

    const { rows: transactions } = await client.query(
      `
     SELECT 
  t.*,
  COALESCE(ARRAY_AGG(tb.basketcode) FILTER (WHERE tb.basketcode IS NOT NULL), '{}') AS baskets
FROM transactions t
LEFT JOIN transactionbaskets tb ON tb.transactionid = t.transactionid
WHERE t.customerid = $1
GROUP BY t.transactionid
`,
      [customerId]
    );

    const { rows: occupiedBaskets } = await client.query(`
      WITH LastStatus AS (
        SELECT
          tb.BasketCode,
          t.Hall,
          t.CustomerID,
          t.TransactionType,
          ROW_NUMBER() OVER (PARTITION BY t.Hall, tb.BasketCode ORDER BY t.TransactionDate DESC, t.TransactionID DESC) AS rn
        FROM TransactionBaskets tb
        JOIN Transactions t ON t.TransactionID = tb.TransactionID
      )
      SELECT Hall, BasketCode, CustomerID
      FROM LastStatus
      WHERE rn = 1 AND TransactionType = 'IN'
      ORDER BY Hall, BasketCode
    `);

    const { rows: myOccupiedBaskets } = await client.query(
      `
      WITH LastStatus AS (
        SELECT
          tb.BasketCode,
          t.Hall,
          t.CustomerID,
          t.TransactionType,
          ROW_NUMBER() OVER (PARTITION BY t.Hall, tb.BasketCode ORDER BY t.TransactionDate DESC, t.TransactionID DESC) AS rn
        FROM TransactionBaskets tb
        JOIN Transactions t ON t.TransactionID = tb.TransactionID
      )
      SELECT Hall, BasketCode
      FROM LastStatus
      WHERE rn = 1 AND TransactionType = 'IN' AND CustomerID = $1
      ORDER BY Hall, BasketCode
    `,
      [customerId]
    );

    const { rows: totals } = await client.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN TransactionType = 'IN' THEN Weight ELSE 0 END), 0) AS total_in,
        COALESCE(SUM(CASE WHEN TransactionType = 'OUT' THEN Weight ELSE 0 END), 0) AS total_out
      FROM Transactions
      WHERE CustomerID = $1
    `,
      [customerId]
    );

    const totalIn = parseFloat(totals[0].total_in);
    const totalOut = parseFloat(totals[0].total_out);

    const occupiedBasketsByHall: Record<string, string[]> = {};
    occupiedBaskets.forEach((row) => {
      if (!occupiedBasketsByHall[row.hall])
        occupiedBasketsByHall[row.hall] = [];
      occupiedBasketsByHall[row.hall].push(row.basketcode);
    });

    const myOccupiedBasketsByHall: Record<string, string[]> = {};
    myOccupiedBaskets.forEach((row) => {
      if (!myOccupiedBasketsByHall[row.hall])
        myOccupiedBasketsByHall[row.hall] = [];
      myOccupiedBasketsByHall[row.hall].push(row.basketcode);
    });

    return Response.json(
      {
        customer,
        transactions,
        occupiedBaskets: occupiedBasketsByHall,
        myOccupiedBaskets: myOccupiedBasketsByHall,
        totalIn,
        totalOut,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
