import { AddBasketType } from "@/types/Basket";
import showToast from "@/utils/showToast";
import { useFormikContext } from "formik";
import { Trash } from "iconsax-react";
import React from "react";
import Swal from "sweetalert2";

interface Props {
  data: string;
  i: number;
}

function ChoseBasket({ i, data }: Props) {
  const { values, setFieldValue } = useFormikContext<AddBasketType>();
  const valueBaskets = data.match(/^([A-Z])(\d{3})$/);

  const changeHall = (hall: string) => {
    const newData = data.replace(/^([A-Z])(\d{3})$/, `${hall}$2`);
    const newBaskets = [...values.basketNumbers];

    newBaskets[i] = newData;

    setFieldValue("basketNumbers", newBaskets);
  };
  const changeBasketNumber = (num: number) => {
    if (num > 999 || num < 1) {
      if (num < 1) changeBasketNumber(1);

      showToast("ورودی نامعتبر");

      return;
    }

    let newData = data.replace(/^([A-Z])(\d{3})$/, (_, letter) => {
      return letter + num;
    });

    newData = newData.replace(/([A-Z])(\d+)/g, (_, letter, num) => {
      return letter + num.padStart(3, "0");
    });

    const newBaskets = [...values.basketNumbers];

    newBaskets[i] = newData;

    setFieldValue("basketNumbers", newBaskets);
  };

  const removeBasket = () => {
    const newBaskets = [...values.basketNumbers];

    newBaskets.splice(i, 1);

    setFieldValue("basketNumbers", newBaskets);
  };

  return (
    <>
      <div className="flex gap-3 items-center">
        <select
          value={valueBaskets?.[1] || "A"}
          onChange={(e) => changeHall(e.target.value)}
          className="w-22 bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="H">H</option>
        </select>
        <input
          type="number"
          value={Number(valueBaskets?.[2]) || 0}
          className="w-full bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
          onChange={(e) => changeBasketNumber(+e.target.value)}
        />
        {values.basketNumbers.length !== 1 && (
          <button
            className="bg-blue02 px-3 py-[10px] h-full rounded cursor-pointer group"
            onClick={removeBasket}
          >
            <Trash className="w-6 h-6 stroke-white group-hover:stroke-red-300" />
          </button>
        )}
      </div>
    </>
  );
}

export default ChoseBasket;
