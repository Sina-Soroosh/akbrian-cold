"use client";

import BasketBox from "@/components/ui/basket/BasketBox";
import Pagination from "@/components/ui/pagination/Pagination";
import { BasketContentType } from "@/types/Basket";
import React, { useEffect, useState } from "react";

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function LandingContent() {
  const [baskets, setBaskets] = useState<BasketContentType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBaskets = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`api/basket/?page=${page}`);
      const data = await res.json();
      setBaskets(data.data || []);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching baskets:", err);
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
            {baskets.map((basket) => (
              <BasketBox data={basket} key={basket.id} />
            ))}
          </>
        )}

        {!loading && baskets.length === 0 ? (
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
