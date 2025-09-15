import Main from "@/components/pages/create-edit/main";
import React from "react";

function page() {
  return (
    <>
      <div className="flex flex-col gap-10">
        <span className="text-3xl font-bold text-white ">ایجاد مشتری</span>

        <Main />
      </div>
    </>
  );
}

export default page;
