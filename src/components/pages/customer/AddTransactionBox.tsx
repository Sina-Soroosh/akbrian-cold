import useCustomer from "@/components/hooks/useCustomer";
import React, { useEffect, useRef, useState } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, {
  DayValue,
  utils,
} from "@hassanmojab/react-modern-calendar-datepicker";
import { BiLoader } from "react-icons/bi";
import HallField from "./HallField";
import BasketFields, { optionsType } from "./BasketFields";
import showToast from "@/utils/showToast";
import { AddTransactionType } from "@/types/Transaction";
import { toGregorian } from "jalaali-js";

function AddTransactionBox() {
  const {
    isAddNew,
    typeNew,
    transactions,
    setValues,
    customer,
    refetchHandler,
  } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);
  const [hall, setHall] = useState<null | string>(null);
  const [baskets, setBaskets] = useState<optionsType[]>([]);
  const weightRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setBaskets([]);
    setSelectedDay(null);
    setHall(null);
  }, [isAddNew]);

  if (!isAddNew) return;

  const addHandler = async () => {
    if (!weightRef.current || !customer || !hall || !selectedDay) return;

    const { gy, gm, gd } = toGregorian(
      selectedDay.year,
      selectedDay.month,
      selectedDay.day
    );

    const date = new Date(gy, gm - 1, gd + 1);

    const body: AddTransactionType = {
      customerId: customer.customerid,
      basketNumbers: baskets.map((b) => String(b.value)),
      hall: hall,
      transactionDate: date,
      transactionType: typeNew,
      weight: +weightRef.current.value,
    };

    try {
      setIsLoading(true);

      const res = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setIsLoading(false);

      const dataResponse = await res.json();

      if (res.status !== 201) {
        showToast(dataResponse.message);
        return;
      }

      refetchHandler();
      setValues({ isAddNew: false });
    } catch {
      showToast("خطای رخ داده");
    }
  };

  const validation = () => {
    if (!selectedDay) {
      showToast("تاریخ را وارد کنید");
      return;
    }

    if (!hall) {
      showToast("سالن را وارد کنید");
      return;
    }

    if (!baskets.length) {
      showToast("باکس ها را انتخاب کنید");
      return;
    }

    const weight = weightRef.current?.value || 0;

    if (!weight) {
      showToast("وزن را وارد کنید");
      return;
    }

    addHandler();
  };

  return (
    <>
      <tr
        className={`items-center  relative py-1 ${
          typeNew === "IN" ? "bg-green-900" : "bg-red-900"
        }`}
      >
        <td className="w-[70px]">{transactions.length + 1}</td>
        <td className="text-2xl text-white min-w-110">
          {typeNew === "IN" ? (
            <DatePicker
              value={selectedDay}
              onChange={setSelectedDay}
              inputPlaceholder="تاریخ ورود"
              locale="fa"
              maximumDate={utils("fa").getToday()}
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
              inputClassName="text-black"
              calendarClassName="my-calendar"
            />
          ) : (
            "----"
          )}
        </td>

        <td className="text-2xl text-white">
          {typeNew === "OUT" ? (
            <DatePicker
              value={selectedDay}
              onChange={setSelectedDay}
              inputPlaceholder="تاریخ خروج"
              locale="fa"
              maximumDate={utils("fa").getToday()}
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
              inputClassName="text-black"
              calendarClassName="my-calendar"
            />
          ) : (
            "----"
          )}
        </td>

        <td>
          <input
            ref={weightRef}
            type="number"
            className="w-50 bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
            placeholder="وزن را وارد کنید"
          />
        </td>

        <td>
          <HallField value={hall} setValue={setHall} />
        </td>

        <td>
          <BasketFields value={baskets} setValue={setBaskets} hall={hall} />
        </td>

        <td>
          <div className="flex items-center h-full gap-1">
            <button
              className="p-2 bg-green-500 text-black rounded cursor-pointer"
              disabled={isLoading}
              onClick={validation}
            >
              {isLoading ? <BiLoader /> : "ثبت"}
            </button>

            <button
              className="p-2 bg-red-500 text-black rounded cursor-pointer"
              disabled={isLoading}
              onClick={() => setValues({ isAddNew: false })}
            >
              {isLoading ? <BiLoader /> : "لغو"}
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default AddTransactionBox;
