"use client";

import { Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import NormalFields from "./fields/NormalFields";
import showToast from "@/utils/showToast";
import { useRouter } from "next/navigation";
import { CreateCustomerType, CustomerContentType } from "@/types/Customer";
import useCustomer from "@/components/hooks/useCustomer";
import SetDefaultValue from "./SetDefaultValue";
import { BiLoader } from "react-icons/bi";
import Swal from "sweetalert2";

const initialValues: CreateCustomerType = {
  firstName: "",
  lastName: "",
  nationalCode: "",
  phone: "",
  productName: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().min(2).max(50).required("نام الزامی است"),
  lastName: Yup.string().min(2).max(50).required("نام خانوادگی الزامی است"),
  nationalCode: Yup.string()
    .length(10, "کدملی باید ۱۰ رقم باشد")
    .matches(/^\d+$/, "کدملی فقط عدد است")
    .required("کدملی الزامی است"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست")
    .required("شماره موبایل الزامی است"),
  productName: Yup.string().required("نام محصول الزامی است"),
});

interface Props {
  data?: CustomerContentType;
}

function Main({ data }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { refetchHandler } = useCustomer();

  const addHandler = async (values: CreateCustomerType) => {
    try {
      const payload = {
        ...values,
      };

      setIsLoading(true);

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setIsLoading(false);

      const data = await res.json();

      if (res.status !== 201) {
        showToast(data.message);
        return;
      }

      if (res.status === 201) {
        router.push(`/customers/${data.data.customerid}`);
        return;
      }
    } catch {
      showToast("خطای رخ داده! دوباره امتحان کنید");
    }
  };

  const updateHandler = async (values: CreateCustomerType) => {
    if (!data) return;

    try {
      const payload = {
        ...values,
      };

      setIsLoading(true);

      const res = await fetch(`/api/customers/${data.customerid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const handleSubmit = async (values: CreateCustomerType) => {
    if (data) updateHandler(values);
    else addHandler(values);
  };

  const removeCustomer = async () => {
    if (!data) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/customers/${data.customerid}`, {
        method: "DELETE",
      });

      setIsLoading(false);

      const dataResponse = await res.json();

      if (res.status !== 200) {
        showToast(dataResponse.message);
        return;
      }

      router.push("/");
    } catch {
      showToast("خطای رخ داده");
    }
  };

  const askIsSure = async () => {
    const res = await Swal.fire({
      title: "از حذف مطمئنید؟",
      text: "این مشتری غیرقابل بازگشت است دیگر",
      icon: "question",
      confirmButtonText: "بله, مطمئنم",
      cancelButtonText: "نه , پشیمان شدم",
      showCancelButton: true,
      confirmButtonColor: "#ff0000",
      cancelButtonColor: "#197121",
    });

    if (res.isConfirmed) removeCustomer();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <>
            <div className="flex flex-wrap justify-between gap-3">
              <NormalFields />
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={submitForm}
                type="submit"
                className="bg-blue02 p-3 rounded w-auto "
                disabled={isLoading}
              >
                {isLoading ? (
                  <BiLoader />
                ) : (
                  <>ثبت {data ? "تغییرات" : ""} مشتری</>
                )}
              </button>

              {data && (
                <button
                  onClick={askIsSure}
                  type="submit"
                  className="bg-red-800 p-3 rounded w-auto "
                  disabled={isLoading}
                >
                  {isLoading ? <BiLoader /> : <>حذف مشتری</>}
                </button>
              )}
            </div>

            {data && <SetDefaultValue data={data} />}
          </>
        )}
      </Formik>
    </>
  );
}

export default Main;
