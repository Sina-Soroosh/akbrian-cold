import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import getUser from "@/utils/getUserServer";
import Main from "@/components/pages/Login/Main/Main";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
};

async function page() {
  const user = await getUser();

  if (user.isLogin !== false) {
    redirect("/");
  }

  return (
    <>
      <Main />
    </>
  );
}

export default page;
