import { AddBasketType } from "@/types/Basket";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import Joi from "joi";

const basketSchema = Joi.object({
  id: Joi.number().positive().required(),
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
  exitDate: Joi.date().greater(Joi.ref("entryDate")).allow(null),
});

const getBasketQuery = () => {
  return `SELECT * FROM FilledBasketsColdStorage WHERE id=$1`;
};

type Params = { params: Promise<{ id: string }> };

export const PUT = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
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

    const { id } = await params;

    const body: AddBasketType = await req.json();

    const { error } = basketSchema.validate(
      { ...body, id },
      { abortEarly: false }
    );

    if (error)
      return Response.json(
        { message: "Params not valid", error },
        { status: 400 }
      );

    if (body.weightEntry < body.weightExit)
      return Response.json({ message: "Params not valid" }, { status: 400 });

    const { rowCount } = await client.query(getBasketQuery(), [id]);

    if (body.weightEntry < body.weightExit)
      return Response.json({ message: "Params not valid" }, { status: 400 });

    if (rowCount !== 1)
      return Response.json({ message: "Params not valid" }, { status: 400 });

    if (!body.exitDate) {
      const queryCheck = `
      SELECT BasketNumbers
      FROM FilledBasketsColdStorage
      WHERE Occupied = TRUE
      AND BasketNumbers && $1::text[] AND id <> $2;
      `;

      const { rowCount: basketCount } = await client.query(queryCheck, [
        body.basketNumbers,
        id,
      ]);

      if (basketCount === null || basketCount !== 0)
        return Response.json(
          { message: "Previously one of the baskets filled" },
          { status: 401 }
        );
    }

    const updateQuery = `
      UPDATE FilledBasketsColdStorage
      SET FirstName=$2,LastName=$3,NationalID=$4,MobileNumber=$5,
        ProductName=$6 , WeightEntry=$7,WeightExit=$8,BasketNumbers=$9,
        Occupied=$10,EntryDate=$11,ExitDate=$12
      WHERE id = $1
      RETURNING *;
    `;

    const values = [
      id,
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

    const { rows } = await client.query(updateQuery, values);

    return Response.json(
      { message: "UPDATE basket successfully", data: rows[0] },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error !!", error },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
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

    const { id } = await params;

    const { rowCount, rows } = await client.query(getBasketQuery(), [id]);

    if (rowCount !== 1)
      return Response.json({ message: "Not found !!" }, { status: 404 });

    return Response.json(
      { data: rows[0] },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error !!", error },
      { status: 500 }
    );
  }
};
