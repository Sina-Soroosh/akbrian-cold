/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";

type Params = { params: Promise<{ id: string }> };

export const DELETE = async (
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

    const transactionId = parseInt((await params).id, 10);
    if (isNaN(transactionId)) {
      return Response.json(
        { message: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const checkQuery = "SELECT * FROM Transactions WHERE TransactionID = $1";
    const { rowCount } = await client.query(checkQuery, [transactionId]);
    if (rowCount === 0) {
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    const deleteQuery = "DELETE FROM Transactions WHERE TransactionID = $1";
    await client.query(deleteQuery, [transactionId]);

    return Response.json(
      { message: "Transaction deleted successfully", transactionId },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
