"use client";

import React, { useState, MouseEvent } from "react";
import Link from "next/link";
import { FaHome, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { convertToSolarDate } from "@/utils/date";
import Loader from "../ui/Loader/Loader";
import styles from "./MainLayout.module.css";
import { FaBasketShopping } from "react-icons/fa6";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const path = usePathname();

  const showMenu = () => setIsShowMenu(true);
  const hideMenu = () => setIsShowMenu(false);

  const logoutHandler = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsFetch(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.status === 200) {
        router.push("/login");
      } else {
        Swal.fire({
          title: "خطایی رخ داده \n لطفا اتصال خود را چک کنید",
          icon: "error",
          confirmButtonText: "متوجه شدم",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "خطایی رخ داده \n لطفا اتصال خود را چک کنید",
        icon: "error",
        confirmButtonText: "متوجه شدم",
      });
    } finally {
      setIsFetch(false);
    }
  };

  return (
    <>
      {isShowMenu ? (
        <div className={styles.cover_page} onClick={hideMenu}></div>
      ) : (
        <></>
      )}
      <div className={styles.layout}>
        <div className="container-fluid">
          <div className="lg:flex gap-2">
            <div
              className={`col-xl-2 lg:w-90 ${styles.menu} ${
                isShowMenu ? styles.active : ""
              }`}
            >
              <div className={styles.close_btn} onClick={hideMenu}>
                <IoClose />
              </div>
              <div className={styles.logo}>
                <Link href="/">سردخانه اکبریان</Link>
              </div>
              <ul className={styles.main}>
                <li>
                  <Link className={path === "/" ? styles.active : ""} href="/">
                    <span className={styles.icon}>
                      <FaHome />
                    </span>
                    صفحه اصلی
                  </Link>
                </li>
                <li>
                  <Link
                    className={path === "search" ? styles.active : ""}
                    href="/search"
                  >
                    <span className={styles.icon}>
                      <FaSearch />
                    </span>
                    جست جو مشتری
                  </Link>
                </li>

                <li>
                  <Link
                    className={path === "search" ? styles.active : ""}
                    href="/search-basket"
                  >
                    <span className={styles.icon}>
                      <FaSearch />
                    </span>
                    جست جو سبد
                  </Link>
                </li>
                <li>
                  <Link
                    className={path === "new-customer" ? styles.active : ""}
                    href="/new-customer"
                  >
                    <span className={styles.icon}>
                      <FaBasketShopping />
                    </span>
                    ایجاد مشتری{" "}
                  </Link>
                </li>

                <li>
                  <Link href="#" onClick={logoutHandler}>
                    <span className={styles.icon}>
                      <FaSignOutAlt />
                    </span>
                    خروج
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-xl-10 lg:w-full">
              <div className={styles.header}>
                <div className={styles.icon_show_menu} onClick={showMenu}>
                  <svg
                    width={19}
                    height={19}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.01554 14.0316C1.23804 14.0316 -0.000244141 12.7933 -0.000244141 7.01579C-0.000244141 1.23829 1.23804 0 7.01554 0C12.793 0 14.0313 1.23829 14.0313 7.01579C14.0313 12.7933 12.793 14.0316 7.01554 14.0316ZM4.0923 3.50789C3.76941 3.50789 3.50765 3.76965 3.50765 4.09254C3.50765 4.41543 3.76941 4.67719 4.0923 4.67719H5.84624C6.16914 4.67719 6.43089 4.41543 6.43089 4.09254C6.43089 3.76965 6.16914 3.50789 5.84624 3.50789H4.0923ZM3.50765 7.01579C3.50765 6.69289 3.76941 6.43114 4.0923 6.43114H9.93879C10.2617 6.43114 10.5234 6.69289 10.5234 7.01579C10.5234 7.33868 10.2617 7.60044 9.93879 7.60044H4.0923C3.7694 7.60044 3.50765 7.33868 3.50765 7.01579ZM8.18484 9.35438C7.86195 9.35438 7.60019 9.61614 7.60019 9.93903C7.60019 10.2619 7.86195 10.5237 8.18484 10.5237H9.93879C10.2617 10.5237 10.5234 10.2619 10.5234 9.93903C10.5234 9.61614 10.2617 9.35438 9.93879 9.35438H8.18484Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className={styles.details}>
                  <div className={styles.title}>
                    <h4>عزیز؛خوش اومدی.</h4>
                  </div>
                  <div className={styles.date}>
                    <h6>{convertToSolarDate(new Date())}</h6>
                  </div>
                </div>
              </div>
              <div className={styles.children}>{children}</div>
            </div>
          </div>
        </div>
      </div>
      {isFetch ? <Loader /> : null}
    </>
  );
};

export default MainLayout;
