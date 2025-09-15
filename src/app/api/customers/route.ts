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
        { message: "This customer with the same product already exists" },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
