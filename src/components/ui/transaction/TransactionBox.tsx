import useCustomer from "@/components/hooks/useCustomer";
import { TransactionContentType } from "@/types/Transaction";
import { convertToSolarDate } from "@/utils/date";
import showToast from "@/utils/showToast";
import React, { useState } from "react";
import { BiLoader } from "react-icons/bi";
import Swal from "sweetalert2";

interface Props {
  row: number;
  data: TransactionContentType;
}

function TransactionBox({ data, row }: Props) {
  const { refetchHandler } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/transactions/${data.transactionid}`, {
        method: "DELETE",
      });

      setIsLoading(false);

      const dataResponse = await res.json();

      if (res.status !== 200) {
        showToast(dataResponse.message);
        return;
      }

      refetchHandler();
    } catch {
      showToast("خطای رخ داده");
    }
  };

  const askIsSure = async () => {
    const res = await Swal.fire({
      title: "از حذف مطمئنید؟",
      text: "این تراکنش غیرقابل بازگشت است دیگر",
      icon: "question",
      confirmButtonText: "بله, مطمئنم",
      cancelButtonText: "نه , پشیمان شدم",
      showCancelButton: true,
      confirmButtonColor: "#ff0000",
      cancelButtonColor: "#197121",
    });

    if (res.isConfirmed) deleteHandler();
  };

  return (
    <>
      <tr
        className={`items-center relative py-1 ${
          data.transactiontype === "IN" ? "bg-green-900" : "bg-red-900"
        }`}
      >
        <td className="w-[30px]">{row}</td>
        <td className="text-2xl text-white">
          {data.transactiontype === "IN"
            ? convertToSolarDate(new Date(data.transactiondate))
            : "----"}
        </td>
        <td className="text-2xl text-white">
          {data.transactiontype === "OUT"
            ? convertToSolarDate(new Date(data.transactiondate))
            : "----"}
        </td>

        <td className="text-2xl text-white">
          {Number(data.weight).toLocaleString()}Kg
        </td>

        <td className="text-2xl text-white">{data.hall}</td>

        <td className="text-2xl text-white">{data.baskets.join(" , ")}</td>

        <td>
          <button
            className="p-2 bg-red-500 text-black rounded cursor-pointer"
            disabled={isLoading}
            onClick={askIsSure}
          >
            {isLoading ? <BiLoader /> : "حذف"}
          </button>
        </td>
      </tr>
    </>
  );
}

export default TransactionBox;
