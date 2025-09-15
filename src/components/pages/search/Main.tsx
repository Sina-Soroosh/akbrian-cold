"use client";
import BasketBox from "@/components/ui/customer/CustomerBox";
import { CustomerContentType } from "@/types/Customer";
import useDebounce from "@/utils/useDebounce";
import React, { useEffect, useState } from "react";

function Main() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerContentType[]>([]);
  const [search, setSearch] = useState("");
  const value = useDebounce(search, 1000);

  const fetchBaskets = async () => {
    if (!search) {
      setCustomers([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`api/customers/search?q=${search}`);
      const data = await res.json();
      setCustomers(data?.data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaskets();
  }, [value]);

  return (
    <>
      <div className="flex flex-col gap-3 w-full justify-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-full w-250 mx-auto bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          placeholder="جستجو کنید (بر اساس نام نام خانوادگی یا کد ملی یا نام محصول یا شماره تماس)"
        />

        {loading ? (
          <span className="text-white text-2xl block text-center">
            درحال دریافت اطلاعات ...
          </span>
        ) : (
          <>
            {customers.map((basket) => (
              <BasketBox data={basket} key={basket.customerid} />
            ))}
          </>
        )}

        {!loading && customers.length === 0 && search !== "" ? (
          <span className="text-white text-2xl block text-center">
            پیدا نشد اطلاعاتی{" "}
          </span>
        ) : null}

        {search === "" ? (
          <span className="text-white text-2xl block text-center">
            جستجو کنید
          </span>
        ) : null}
      </div>
    </>
  );
}

export default Main;
