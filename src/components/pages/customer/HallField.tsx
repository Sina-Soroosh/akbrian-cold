import useCustomer from "@/components/hooks/useCustomer";
import React, { useEffect, useState } from "react";

interface Props {
  value: string | null;
  setValue: (value: string) => void;
}

function HallField({ setValue, value }: Props) {
  const { typeNew, myOccupiedBaskets } = useCustomer();
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (typeNew === "IN") setOptions(["A", "B", "C", "D", "E", "F", "G", "H"]);
    else {
      const entiresOccupied = Object.entries(myOccupiedBaskets);

      const newOptions: string[] = [];

      entiresOccupied.map((occ) => newOptions.push(occ[0]));

      setOptions(newOptions);
    }
  }, [typeNew]);

  return (
    <>
      <select
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        className="w-22 bg-blue02  border border-blue02 text-[15px] px-[10px] py-[5px] rounded-[5px] text-[#fff] [transition:.3s]"
      >
        <option value={""}>---</option>
        {options.map((option, i) => (
          <option value={option} key={i}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

export default HallField;
