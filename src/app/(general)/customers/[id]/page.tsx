import MainCustomer from "@/components/pages/customer/MainCustomer";
import React from "react";

type Props = { params: Promise<{ id: string }> };

async function page({ params }: Props) {
  return (
    <>
      <MainCustomer id={(await params).id} />
    </>
  );
}

export default page;
