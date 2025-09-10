import { AddBasketType } from "@/types/Basket";
import { useFormikContext } from "formik";
import React from "react";
import ChoseBasket from "./ChoseBasket";

function BasketFields() {
  const { values, setFieldValue } = useFormikContext<AddBasketType>();

  const addBasket = () => {
    const newBaskets = [...values.basketNumbers];

    newBaskets.push("A001");

    setFieldValue("basketNumbers", newBaskets);
  };

  return (
    <>
      <div className={`w-100 flex flex-col gap-2`}>
        <div className="flex gap-7 justify-between items-center">
          <label htmlFor="user" className="text-[15px] text-[#d1d7e2] mb-[5px]">
            سبد ها
          </label>

          <button
            className="bg-blue02 px-3 py-1 rounded cursor-pointer"
            onClick={addBasket}
          >
            +
          </button>
        </div>

        {values.basketNumbers.map((basket, i) => (
          <ChoseBasket i={i} key={i} data={basket} />
        ))}
      </div>
    </>
  );
}

export default BasketFields;
