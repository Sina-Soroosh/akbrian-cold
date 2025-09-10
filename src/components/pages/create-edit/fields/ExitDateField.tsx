import React, { useEffect, useState } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, {
  DayValue,
  utils,
} from "@hassanmojab/react-modern-calendar-datepicker";
import { useFormikContext } from "formik";
import { AddBasketType } from "@/types/Basket";
import { Trash } from "iconsax-react";
import jalaali from "jalaali-js";

interface Props {
  isEdit: boolean;
}

function ExitDateField({ isEdit }: Props) {
  const { values, setFieldValue } = useFormikContext<AddBasketType>();
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);

  useEffect(() => {
    if (values.exitDate) {
      const { jy, jm, jd } = jalaali.toJalaali(
        values.exitDate.getFullYear(),
        values.exitDate.getMonth() + 1,
        values.exitDate.getDate() - (isEdit ? 0 : 1)
      );

      const formattedDate = {
        year: jy,
        month: jm,
        day: jd,
      };

      setSelectedDay(formattedDate);
    } else setSelectedDay(null);
  }, [values.exitDate]);

  const changeDate = (value: DayValue) => {
    if (value) {
      const { gy, gm, gd } = jalaali.toGregorian(
        value.year,
        value.month,
        value.day + 1
      );

      const date = new Date(gy, gm - 1, gd);

      setFieldValue("exitDate", date);
    } else setFieldValue("exitDate", null);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          تاریخ خروج (اختیاری)
        </label>
        <div className=" bg-blue02 items-center border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]">
          <DatePicker
            value={selectedDay}
            onChange={changeDate}
            inputPlaceholder="تاریخ خروج"
            locale="fa"
            maximumDate={utils("fa").getToday()}
            shouldHighlightWeekends
            calendarPopperPosition="bottom"
            inputClassName="bg-[#091d30!important] border-[#091d30_!important]" // custom class
          />

          {values.exitDate && (
            <button
              className="bg-blue02 px-3 py-1 py-1 rounded cursor-pointer group"
              onClick={() => changeDate(null)}
            >
              <Trash className="w-6 h-6 stroke-white group-hover:stroke-red-300" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ExitDateField;
