import { CustomerContentType } from "@/types/Customer";
import Link from "next/link";
import React from "react";

interface Props {
  data: CustomerContentType;
}

function CustomerBox({ data }: Props) {
  return (
    <>
      <Link href={`/customers/${data.customerid}`}>
        <div className="flex flex-col gap-4 w-full p-3 bg-blue02 rounded">
          <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
            <span className="text-blue01 text-2xl font-bold">
              {data.firstname} {data.lastname}
            </span>
            <span className="text-blue01 text-2xl font-bold">{data.phone}</span>
            <span className="text-blue01 text-2xl font-bold">
              {data.nationalcode}
            </span>

            <span className="text-blue01 text-2xl font-bold">
              {data.productname}
            </span>
          </div>
          {data.total_in && data.total_out && (
            <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
              <span className="text-blue01 text-2xl">
                وزن وارد شده :
                <br />
                <span className="font-bold flex w-full text-left justify-end ">
                  {Number(data.total_in)}Kg
                </span>
              </span>

              <span className="text-blue01 text-2xl">
                وزن خارج شده :
                <br />
                <span className="font-bold flex w-full text-left justify-end">
                  {Number(data.total_out)}Kg
                </span>
              </span>
            </div>
          )}
        </div>
      </Link>
    </>
  );
}

export default CustomerBox;
