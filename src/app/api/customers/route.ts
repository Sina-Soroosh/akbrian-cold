/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import Joi from "joi";

const customerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  nationalCode: Joi.string().length(10).pattern(/^\d+$/).required(),
  phone: Joi.string()
    .pattern(/^09\d{9}$/)
    .required(),
  productName: Joi.string().required(),
});

export const POST = async (req: NextRequest): Promise<Response> => {
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
    const { error } = customerSchema.validate(body, { abortEarly: false });

    if (error) {
      return Response.json(
        { message: "Params not valid", error: error.details },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO Customers (FirstName, LastName, NationalCode, Phone, ProductName)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const values = [
      body.firstName,
      body.lastName,
      body.nationalCode,
      body.phone,
      body.productName,
    ];

    const { rows } = await client.query(insertQuery, values);

    return Response.json(
      { message: "Customer created successfully", data: rows[0] },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === "23505") {
      return Response.json(
        { message: "این مشتری با این محصول از قبل ثبت نام شده " },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request): Promise<Response> => {
  try {
    const client = await getClient();
    if (!client)
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );

    const { isLogin } = await getUser();
    if (!isLogin)
      return Response.json({ message: "Unauthorized" }, { status: 403 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const query = `
  SELECT 
    c.*,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'IN' THEN t.weight ELSE 0 END), 0) AS total_in,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'OUT' THEN t.weight ELSE 0 END), 0) AS total_out
  FROM customers c
  LEFT JOIN transactions t ON t.customerid = c.customerid
  GROUP BY c.customerid
  ORDER BY c.customerid DESC
  LIMIT $1 OFFSET $2
`;
    const { rows } = await client.query(query, [pageSize, offset]);

    const countQuery = `SELECT COUNT(*) AS total FROM customers;`;
    const { rows: countRows } = await client.query(countQuery);
    const total = parseInt(countRows[0].total, 10);

    return Response.json(
      {
        data: rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};
