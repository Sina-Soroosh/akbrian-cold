import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await getClient();
    if (!client) {
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    const { isLogin } = await getUser();
    if (!isLogin) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { rows: customers } = await client.query("SELECT * FROM Customers");
    const { rows: transactions } = await client.query(
      "SELECT * FROM Transactions"
    );
    const { rows: transactionBaskets } = await client.query(
      "SELECT * FROM TransactionBaskets"
    );

    const dateNow = new Date().toISOString();

    const backup = {
      customers,
      transactions,
      transactionBaskets,
      createdAt: dateNow,
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="backup-${dateNow}.json`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 }
    );
  }
}
