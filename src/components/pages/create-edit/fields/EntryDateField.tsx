import React, { useEffect, useState } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, {
  DayValue,
  utils,
} from "@hassanmojab/react-modern-calendar-datepicker";
import { useFormikContext } from "formik";
import { AddBasketType } from "@/types/Basket";
import jalaali from "jalaali-js";

interface Props {
  isEdit: boolean;
}

function EntryDateField({ isEdit }: Props) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<AddBasketType>();
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);

  useEffect(() => {
    if (!values.entryDate) return;

    const { jy, jm, jd } = jalaali.toJalaali(
      values.entryDate.getFullYear(),
      values.entryDate.getMonth() + 1,
      values.entryDate.getDate() - (isEdit ? 0 : 1)
    );

    const formattedDate = {
      year: jy,
      month: jm,
      day: jd,
    };

    setSelectedDay(formattedDate);
  }, [values.entryDate]);

  const changeDate = (value: DayValue) => {
    if (!value) return;

    const { gy, gm, gd } = jalaali.toGregorian(
      value.year,
      value.month,
      value.day + 1
    );

    const date = new Date(gy, gm - 1, gd);

    setFieldValue("entryDate", date);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          تاریخ ورود
        </label>
        <div className=" bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]">
          <DatePicker
            value={selectedDay}
            onChange={changeDate}
            inputPlaceholder="تاریخ ورود"
            locale="fa"
            maximumDate={utils("fa").getToday()}
            shouldHighlightWeekends
            calendarPopperPosition="bottom"
            inputClassName="bg-[#091d30!important] border-[#091d30_!important]" // custom class
          />
        </div>

        {errors.entryDate && touched.entryDate && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.entryDate as string}
          </p>
        )}
      </div>
    </>
  );
}

export default EntryDateField;
