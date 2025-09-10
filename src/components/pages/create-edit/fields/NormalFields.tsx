import { AddBasketType } from "@/types/Basket";
import { useFormikContext } from "formik";
import React from "react";

function NameFields() {
  const { errors, touched, setFieldValue, values } =
    useFormikContext<AddBasketType>();

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
          value={values.nationalID}
          onChange={(e) => setFieldValue("nationalID", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="کدملی  را وارد کنید"
        />

        {errors.nationalID && touched.nationalID && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.nationalID}
          </p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          شماره موبایل
        </label>
        <input
          value={values.mobileNumber}
          onChange={(e) => setFieldValue("mobileNumber", e.target.value)}
          type="text"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="شماره موبایل  را وارد کنید"
        />

        {errors.mobileNumber && touched.mobileNumber && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.mobileNumber}
          </p>
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

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          وزن وارد شده بر حسب کیلو گرم:
        </label>
        <input
          value={values.weightEntry}
          onChange={(e) => setFieldValue("weightEntry", e.target.value)}
          type="number"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="وزن را وارد کنید"
        />

        {errors.weightEntry && touched.weightEntry && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.weightEntry}
          </p>
        )}
      </div>

      <div className={`w-100`}>
        <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
          وزن خارج شده بر حسب کیلو گرم:
        </label>
        <input
          value={values.weightExit}
          onChange={(e) => setFieldValue("weightExit", e.target.value)}
          type="number"
          id="user"
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="وزن را وارد کنید"
        />

        {errors.weightExit && touched.weightExit && (
          <p className="text-red-400 text-xl font-bold py-2">
            {errors.weightExit}
          </p>
        )}
      </div>
    </>
  );
}

export default NameFields;
