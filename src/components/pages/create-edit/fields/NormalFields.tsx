import { CreateCustomerType } from "@/types/Customer";
import { useFormikContext } from "formik";
import React from "react";

function NameFields() {
  const { errors, touched, setFieldValue, values } =
    useFormikContext<CreateCustomerType>();

  return (
    <>
      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          نام
        </label>
        <input
          type="text"
          id="user"
          value={values.firstName}
          onChange={(e) => setFieldValue("firstName", e.target.value)}
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="نام  را وارد کنید"
        />

        {errors.firstName && touched.firstName && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.firstName}
          </p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          نام خانوادگی
        </label>
        <input
          value={values.lastName}
          onChange={(e) => setFieldValue("lastName", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="نام خانوادگی را وارد کنید"
        />

        {errors.lastName && touched.lastName && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.lastName}
          </p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          کدملی
        </label>
        <input
          value={values.nationalCode}
          onChange={(e) => setFieldValue("nationalCode", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="کدملی  را وارد کنید"
        />

        {errors.nationalCode && touched.nationalCode && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.nationalCode}
          </p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          شماره موبایل
        </label>
        <input
          value={values.phone}
          onChange={(e) => setFieldValue("phone", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="شماره موبایل  را وارد کنید"
        />

        {errors.phone && touched.phone && (
          <p className="text-red-400 text-xl font-bold py-2">{errors.phone}</p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          نام محصول
        </label>
        <input
          value={values.productName}
          onChange={(e) => setFieldValue("productName", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="شماره موبایل  را وارد کنید"
        />

        {errors.productName && touched.productName && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.productName}
          </p>
        )}
      </div>
    </>
  );
}

export default NameFields;
