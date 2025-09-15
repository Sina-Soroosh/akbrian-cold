/* eslint-disable @typescript-eslint/no-explicit-any */
import useCustomer from "@/components/hooks/useCustomer";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import React, { useEffect, useState } from "react";
import { components } from "react-select";
import WindowedSelect from "react-windowed-select";

export interface optionsType {
  value: string | number;
  label: string;
  id: number;
  isDisabled?: boolean;
}

interface Props {
  hall: string | null;
  value: optionsType[];
  setValue: (value: optionsType[]) => void;
}

const Option = (props: any) => {
  return (
    <components.Option {...props} className="w-full h-full">
      <div className="w-full h-full flex items-center">
        <Checkbox
          isChecked={props.isSelected}
          labelText={props.label}
          onChange={() => {}}
          containerStyle="text-black text-right w-full"
        />
      </div>
    </components.Option>
  );
};

function BasketFields({ hall, value, setValue }: Props) {
  const { typeNew, occupiedBaskets, myOccupiedBaskets } = useCustomer();
  const [options, setOptions] = useState<optionsType[]>([]);

  const setOptionsIn = () => {
    if (!hall) {
      setOptions([]);
      return;
    }

    let newOptions: optionsType[] = Array.from({ length: 600 }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
      value: i + 1,
    }));

    const occupiedBasketCurrent = occupiedBaskets[hall]
      ? occupiedBaskets[hall].map((_) => +_)
      : [];

    if (occupiedBasketCurrent.length !== 0) {
      newOptions = newOptions.filter(
        (option) => !occupiedBasketCurrent.includes(+option.value)
      );
    }

    setOptions(newOptions);
  };

  const setOptionsOut = () => {
    if (!hall) {
      setOptions([]);
      return;
    }

    const occupiedBasketCurrent = myOccupiedBaskets[hall]
      ? myOccupiedBaskets[hall].map((_) => +_)
      : [];

    const newOptions: optionsType[] = [];

    occupiedBasketCurrent.forEach((number) =>
      newOptions.push({ id: number, label: String(number), value: number })
    );

    setOptions(newOptions);
  };

  useEffect(() => {
    setValue([]);

    if (typeNew === "IN") setOptionsIn();
    else setOptionsOut();
  }, [hall]);

  const changeValueBasket = (values: any) => setValue(values);

  return (
    <>
      <WindowedSelect
        windowThreshold={50}
        options={options}
        isMulti
        closeMenuOnSelect={false}
        components={{ Option }}
        menuPortalTarget={document.body}
        value={value}
        onChange={changeValueBasket}
        className="w-80"
        styles={{
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#2563eb", // رنگ پس‌زمینه آیتم انتخاب شده
            borderRadius: "8px",
            padding: "2px 6px",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white", // رنگ متن آیتم انتخاب شده
            fontWeight: 500,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            ":hover": {
              backgroundColor: "#1e40af", // رنگ hover برای دکمه حذف
              color: "white",
            },
          }),
        }}
      />
    </>
  );
}

export default BasketFields;
