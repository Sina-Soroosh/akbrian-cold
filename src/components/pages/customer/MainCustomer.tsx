"use client";

import useCustomer from "@/components/hooks/useCustomer";
import Loader from "@/components/ui/Loader/Loader";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Main from "../create-edit/main";
import TransactionBox from "@/components/ui/transaction/TransactionBox";
import Swal from "sweetalert2";
import AddTransactionBox from "./AddTransactionBox";

interface Props {
  id: string;
}

function MainCustomer({ id }: Props) {
  const {
    setValues,
    isLoading,
    customer,
    totalIn,
    totalOut,
    transactions,
    isAddNew,
    resetAll,
  } = useCustomer();
  const router = useRouter();

  const fetchHandler = async () => {
    setValues({ isLoading: true });

    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();

      if (res.status === 200) {
        setValues({ ...data });

        return;
      }

      router.push("/");
    } catch (err) {
      router.push("/");
    } finally {
      setValues({ isLoading: false });
    }
  };

  useEffect(() => {
    setValues({ refetchHandler: fetchHandler });
    fetchHandler();

    return () => {
      resetAll();
    };
  }, []);

  if (isLoading) return <Loader />;

  const addTransaction = () => {
    Swal.fire({
      title: "نوع ثبت مشخص کنید",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "ورود",
      denyButtonText: `خروج`,
      confirmButtonColor: "#197121",
      customClass: {
        title: "text-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setValues({ isAddNew: true, typeNew: "IN" });
      } else if (result.isDenied) {
        setValues({ isAddNew: true, typeNew: "OUT" });
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-10">
        {customer && <Main data={customer} />}

        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex gap-x-7 items-center gap-y-4 flex-wrap">
              <span className="text-blue01 text-2xl">
                وزن وارد شده :
                <br />
                <span className="font-bold flex w-full text-left justify-end ">
                  {Number(totalIn)}Kg
                </span>
              </span>

              <span className="text-blue01 text-2xl">
                وزن خارج شده :
                <br />
                <span className="font-bold flex w-full text-left justify-end">
                  {Number(totalOut)}Kg
                </span>
              </span>
            </div>
          </div>

          {isAddNew || (
            <button
              className="bg-blue02 px-3 py-1 rounded cursor-pointer"
              onClick={addTransaction}
            >
              +
            </button>
          )}
        </div>

        <div
          className="max-w-full overflow-x-auto"
          style={{
            height: transactions.length * 70 + 400,
          }}
        >
          <table className="border-0 min-w-full text-center table-fixed">
            <thead>
              <tr className="border-b border-gray_borders">
                <th>ردیف</th>
                <th>تاریخ ورود</th>
                <th>تاریخ خروج</th>
                <th>وزن کل (Kg)</th>
                <th>سالن</th>
                <th>کد باکس</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray1 items-center">
              {transactions.map((transaction, i) => (
                <TransactionBox
                  key={transaction.transactionid}
                  data={transaction}
                  row={i + 1}
                />
              ))}

              <AddTransactionBox />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MainCustomer;
