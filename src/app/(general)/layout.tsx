import getUser from "@/utils/getUserServer";
import { redirect } from "next/navigation";
import React from "react";

async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user.isLogin === false) {
    redirect("/login");
  }

  return <>{children}</>;
}

export default layout;
