import { BasketContentType } from "@/types/Basket";
import { convertToSolarDate } from "@/utils/date";
import Link from "next/link";
import React from "react";

interface Props {
  data: BasketContentType;
}

function BasketBox({ data }: Props) {
  return (
    <>
      <Link href={`/baskets/${data.id}`}>
        <div className="flex flex-col gap-4 w-full p-3 bg-blue02 rounded">
          <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
            <span className="text-blue01 text-2xl font-bold">
              {data.firstname} {data.lastname}
            </span>
            <span className="text-blue01 text-2xl font-bold">
              {data.mobilenumber}
            </span>
            <span className="text-blue01 text-2xl font-bold">
              {data.nationalid}
            </span>
          </div>

          <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
            <span className="text-blue01 text-2xl">
              محصول : <span className="font-bold">{data.productname}</span>
            </span>
            <span className="text-blue01 text-2xl">
              وزن ورودی :{" "}
              <span className="font-bold">{data.weightentry} KG</span>
            </span>
            <span className="text-blue01 text-2xl">
              وزن خارج شده :{" "}
              <span className="font-bold">{data.weightexit} KG</span>
            </span>
          </div>

          <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
            <span className="text-blue01 text-2xl">
              سبد ها اشغال شده :{" "}
              <span className="font-bold">
                {data.basketnumbers.join(" , ")}
              </span>
            </span>
          </div>

          <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
            <span className="text-blue01 text-2xl">
              تاریخ ورود :{" "}
              <span className="font-bold">
                {convertToSolarDate(new Date(data.entrydate))}
              </span>
            </span>
            {data.exitdate && (
              <span className="text-blue01 text-2xl">
                تاریخ خروج:{" "}
                <span className="font-bold">
                  {convertToSolarDate(new Date(data.exitdate))}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}

export default BasketBox;
