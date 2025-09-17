/* eslint-disable @typescript-eslint/no-explicit-any */
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import { NextResponse } from "next/server";

function validateBackup(backup: any) {
  if (typeof backup !== "object" || backup === null) return false;

  if (!Array.isArray(backup.customers)) return false;
  if (!Array.isArray(backup.transactions)) return false;
  if (!Array.isArray(backup.transactionBaskets)) return false;

  for (const c of backup.customers) {
    if (
      !("customerid" in c) ||
      !("firstname" in c) ||
      !("lastname" in c) ||
      !("nationalcode" in c) ||
      !("productname" in c)
    )
      return false;
  }

  for (const t of backup.transactions) {
    if (
      !("transactionid" in t) ||
      !("customerid" in t) ||
      !("transactiontype" in t) ||
      !("weight" in t) ||
      !("hall" in t)
    )
      return false;
  }

  for (const b of backup.transactionBaskets) {
    if (
      !("transactionbasketid" in b) ||
      !("transactionid" in b) ||
      !("basketcode" in b)
    )
      return false;
  }

  return true;
}

export async function POST(req: Request) {
  const client = await getClient();
  if (!client) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  try {
    const { isLogin } = await getUser();
    if (!isLogin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ message: "فایل پیدا نشد" }, { status: 400 });
    }

    const text = await file.text();
    const backup = JSON.parse(text);

    if (!validateBackup(backup)) {
      return NextResponse.json(
        { message: "ساختار فایل بکاپ نامعتبر است" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    await client.query(
      "TRUNCATE TABLE TransactionBaskets RESTART IDENTITY CASCADE"
    );
    await client.query("TRUNCATE TABLE Transactions RESTART IDENTITY CASCADE");
    await client.query("TRUNCATE TABLE Customers RESTART IDENTITY CASCADE");

    // Customers
    for (const c of backup.customers) {
      await client.query(
        `INSERT INTO customers (customerid, firstname, lastname, nationalcode, phone, productname) 
   VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          c.customerid,
          c.firstname,
          c.lastname,
          c.nationalcode,
          c.phone,
          c.productname,
        ]
      );
    }

    // Transactions
    for (const t of backup.transactions) {
      await client.query(
        `INSERT INTO transactions (transactionid, customerid, transactiontype, transactiondate, weight, hall) 
   VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          t.transactionid,
          t.customerid,
          t.transactiontype,
          t.transactiondate,
          t.weight,
          t.hall,
        ]
      );
    }

    for (const b of backup.transactionBaskets) {
      await client.query(
        `INSERT INTO transactionbaskets (transactionbasketid, transactionid, basketcode) 
         VALUES ($1,$2,$3)`,
        [b.transactionbasketid, b.transactionid, b.basketcode]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "بکاپ با موفقیت بازگردانی شد" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Restore error:", error);
    return NextResponse.json(
      { error: "خطا در بازگردانی دیتابیس" },
      { status: 500 }
    );
  }
}
