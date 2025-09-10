/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AddBasketType, BasketContentType } from "@/types/Basket";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import NormalFields from "./fields/NormalFields";
import BasketFields from "./fields/BasketFields";
import EntryDateField from "./fields/EntryDateField";
import ExitDateField from "./fields/ExitDateField";
import showToast from "@/utils/showToast";
import { useRouter } from "next/navigation";
import SetDefaultValue from "./SetDefaultValue";

const initialValues: AddBasketType = {
  firstName: "",
  lastName: "",
  nationalID: "",
  mobileNumber: "",
  productName: "",
  weightEntry: 0,
  weightExit: 0,
  basketNumbers: ["A001"],
  entryDate: null as any,
  exitDate: undefined,
};

const validationSchema = Yup.object({
  firstName: Yup.string().min(2).max(50).required("نام الزامی است"),
  lastName: Yup.string().min(2).max(50).required("نام خانوادگی الزامی است"),
  nationalID: Yup.string()
    .length(10, "کدملی باید ۱۰ رقم باشد")
    .matches(/^\d+$/, "کدملی فقط عدد است")
    .required("کدملی الزامی است"),
  mobileNumber: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست")
    .required("شماره موبایل الزامی است"),
  productName: Yup.string().required("نام محصول الزامی است"),
  weightEntry: Yup.number()
    .positive("عدد وارد کنید")
    .required("وزن ورودی الزامی است"),
  weightExit: Yup.number().min(0, "وزن خروجی نمی‌تواند منفی باشد"),
  basketNumbers: Yup.array()
    .of(Yup.string())
    .min(1, "حداقل یک سبد انتخاب کنید"),
  entryDate: Yup.date().required("تاریخ ورود الزامی است"),
  exitDate: Yup.date().nullable(),
});

interface Props {
  data?: BasketContentType;
}

function Main({ data }: Props) {
  const router = useRouter();

  const addHandler = async (values: AddBasketType) => {
    try {
      const payload = {
        ...values,
      };

      const res = await fetch("/api/basket/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        showToast("قبلا این سبد ها پر شده");
        return;
      }

      if (res.status === 400) {
        showToast("اطلاعات نامعتبر");
        return;
      }

      if (res.status === 201) {
        router.push("/");
        return;
      } else {
        showToast("خطای رخ داده");
      }
    } catch {
      showToast("خطای رخ داده");
    }
  };

  const updateHandler = async (values: AddBasketType) => {
    if (!data) return;

    try {
      const payload = {
        ...values,
      };

      const res = await fetch(`/api/basket/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        showToast("قبلا این سبد ها پر شده");
        return;
      }

      if (res.status === 400) {
        showToast("اطلاعات نامعتبر");
        return;
      }

      if (res.status === 200) {
        router.push("/");
        return;
      } else {
        showToast("خطای رخ داده");
      }
    } catch {
      showToast("خطای رخ داده");
    }
  };

  const handleSubmit = async (values: AddBasketType) => {
    if (data) updateHandler(values);
    else addHandler(values);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm, values }) => (
          <>
            <div className="flex flex-wrap justify-between gap-3">
              <NormalFields />
            </div>

            <div className="flex flex-wrap  justify-between gap-3">
              <BasketFields />

              <EntryDateField
                isEdit={
                  data?.entrydate?.toString() === values.entryDate?.toString()
                }
              />

              <ExitDateField
                isEdit={
                  data?.exitdate?.toString() === values.exitDate?.toString()
                }
              />
            </div>

            <button
              onClick={submitForm}
              type="submit"
              className="bg-blue02 p-3 rounded w-fit mx-auto"
            >
              ثبت سبد
            </button>

            {data && <SetDefaultValue data={data} />}
          </>
        )}
      </Formik>
    </>
  );
}

export default Main;
