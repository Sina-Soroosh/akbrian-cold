import { AddBasketType } from "@/types/Basket";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import Joi from "joi";

const basketSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  nationalID: Joi.string().length(10).pattern(/^\d+$/).required(),
  mobileNumber: Joi.string()
    .pattern(/^09\d{9}$/)
    .required(),
  productName: Joi.string().required(),
  weightEntry: Joi.number().precision(2).positive().required(),
  weightExit: Joi.number().precision(2).min(0).required(),
  basketNumbers: Joi.array().items(Joi.string()).unique().min(1).required(),
  entryDate: Joi.date().required(),
  exitDate: Joi.date().greater(Joi.ref("EntryDate")).allow(null),
});

export const POST = async (req: Request): Promise<Response> => {
  try {
    const client = await getClient();

    if (!client) {
      return Response.json(
        { message: "Internal Server Error !!" },
        { status: 500 }
      );
    }

    const { isLogin } = await getUser();

    if (!isLogin)
      return Response.json({ message: "Unauthorize !!" }, { status: 403 });

    const body: AddBasketType = await req.json();

    const { error } = basketSchema.validate(body, { abortEarly: false });

    if (error)
      return Response.json(
        { message: "Params not valid", error },
        { status: 400 }
      );

    if (body.weightEntry < body.weightExit)
      return Response.json({ message: "Params not valid" }, { status: 400 });

    const queryCheck = `
    SELECT BasketNumbers
    FROM FilledBasketsColdStorage
    WHERE Occupied = TRUE
      AND BasketNumbers && $1::text[];
  `;

    const { rowCount } = await client.query(queryCheck, [body.basketNumbers]);

    if (rowCount === null || rowCount !== 0)
      return Response.json(
        { message: "Previously one of the baskets filled" },
        { status: 401 }
      );

    const insertQuery = `
      INSERT INTO FilledBasketsColdStorage
      (FirstName, LastName, NationalID, MobileNumber, ProductName, WeightEntry,WeightExit, BasketNumbers, Occupied, EntryDate, ExitDate)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;

    const values = [
      body.firstName,
      body.lastName,
      body.nationalID,
      body.mobileNumber,
      body.productName,
      body.weightEntry,
      body.weightExit,
      body.basketNumbers,
      body.exitDate ? false : true,
      body.entryDate,
      body.exitDate || null,
    ];

    const { rows } = await client.query(insertQuery, values);

    return Response.json(
      { message: "Create basket successfully", data: rows[0] },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error !!", error },
      { status: 500 }
    );
  }
};
