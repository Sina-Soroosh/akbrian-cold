"use client";

import CustomerBox from "@/components/ui/customer/CustomerBox";
import Pagination from "@/components/ui/pagination/Pagination";
import { CustomerContentType } from "@/types/Customer";
import React, { useEffect, useState } from "react";

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function LandingContent() {
  const [customers, setCustomers] = useState<CustomerContentType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBaskets = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`api/customers/?page=${page}`);
      const data = await res.json();
      setCustomers(data.data || []);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaskets(1);
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <span className="text-3xl text-white block my-4 font-bold">
          لیست سبد های پر شده :{" "}
        </span>

        {loading ? (
          <span className="text-white text-2xl block text-center">
            درحال دریافت اطلاعات ...
          </span>
        ) : (
          <>
            {customers.map((customer) => (
              <CustomerBox data={customer} key={customer.customerid} />
            ))}
          </>
        )}

        {!loading && customers.length === 0 ? (
          <span className="text-white text-2xl block text-center">
            اطلاعات خالی است{" "}
          </span>
        ) : null}

        {pagination && pagination.totalPages ? (
          <div className="py-4">
            <Pagination
              activePage={pagination.page}
              numberOfPages={pagination.totalPages}
              onChangePage={fetchBaskets}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default LandingContent;
