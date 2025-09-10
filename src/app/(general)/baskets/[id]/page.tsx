import Main from "@/components/pages/create-edit/main";
import { BasketContentType } from "@/types/Basket";
import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";
import { redirect } from "next/navigation";
import React from "react";

type Props = { params: Promise<{ id: string }> };

async function page({ params }: Props) {
  try {
    const client = await getClient();

    if (!client) {
      redirect("/");
    }

    const { isLogin } = await getUser();

    if (!isLogin) redirect("/");

    const { id } = await params;

    const { rowCount, rows } = await client.query(
      `SELECT * FROM FilledBasketsColdStorage WHERE id=$1`,
      [id]
    );

    if (rowCount !== 1) redirect("/");

    const basket: BasketContentType = rows[0];

    return (
      <>
        <div className="flex flex-col gap-10">
          <span className="text-3xl font-bold text-white ">ویرایش </span>

          <Main data={basket} />
        </div>
      </>
    );
  } catch {
    redirect("/");
  }
}

export default page;
