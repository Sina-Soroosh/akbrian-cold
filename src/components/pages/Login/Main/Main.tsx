"use client";

import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import showToast from "@/utils/showToast";
import Loader from "@/components/ui/loader/Loader";

function Main() {
  const router = useRouter();
  const [isShowLoader, setIsShowLoader] = useState<boolean>(false);
  const usernameRef = useRef<null | HTMLInputElement>(null);
  const passwordRef = useRef<null | HTMLInputElement>(null);

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
    };

    setIsShowLoader(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    setIsShowLoader(false);

    switch (response.status) {
      case 404:
        showToast("همچین کاربری وجود ندارد");
        break;
      case 200:
        await Swal.fire({
          title: "خوش آمدید",
          confirmButtonText: "ورود به صفحه اصلی",
          icon: "success",
          confirmButtonColor: "#1E5128",
        });

        router.replace("/");
        break;

      default:
        showToast("خطایی رخ داده اتصال خود را چک کنید");
        break;
    }
  };

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={loginHandler}>
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            نام کاربری:{" "}
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="نام کاربری"
            required
            ref={usernameRef}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            رمز عبور
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            ref={passwordRef}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          ورود
        </button>
      </form>
      {isShowLoader ? <Loader /> : null}
    </>
  );
}

export default Main;
