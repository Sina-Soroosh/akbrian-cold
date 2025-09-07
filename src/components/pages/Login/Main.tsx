"use client";

import React, { useRef, useState } from "react";
import styles from "./Main.module.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Loader from "@/components/ui/Loader/Loader";

function Main() {
  const [isFetch, setIsFetch] = useState(false);
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usernameRef.current || !passwordRef.current) return;

    const userInfo = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    setIsFetch(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    setIsFetch(false);

    if (res.status === 200) {
      Swal.fire({
        title: "خوش آمدید",
        icon: "success",
        confirmButtonText: "ورود",
      }).then(() => router.push("/"));
    } else if (res.status === 404) {
      Swal.fire({
        title: "همچین کاربری وجود ندارد",
        icon: "error",
        confirmButtonText: "متوجه شدم",
      });
    } else if (res.status === 422) {
      Swal.fire({
        title: "مقادیر وارد شده معتبر نیست",
        icon: "error",
        confirmButtonText: "متوجه شدم",
      });
    } else {
      Swal.fire({
        title: "خطایی رخ داده \n لطفا اتصال خود را چک کنید",
        icon: "error",
        confirmButtonText: "متوجه شدم",
      });
    }
  };

  return (
    <>
      <section className={styles.main}>
        <div className={styles.content}>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <div className={styles.signin}>
            <div className={styles.content_signin}>
              <h2>ورود</h2>

              <form className={styles.form} onSubmit={loginHandler}>
                <div className={styles.inputBox}>
                  <input type="text" ref={usernameRef} required minLength={3} />{" "}
                  <i>نام کاربری</i>
                </div>

                <div className={styles.inputBox}>
                  <input
                    type="password"
                    ref={passwordRef}
                    required
                    minLength={4}
                  />{" "}
                  <i>رمز عبور</i>
                </div>

                <div className={styles.inputBox}>
                  <input type="submit" value="ورود" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {isFetch ? <Loader /> : null}
    </>
  );
}

export default Main;
