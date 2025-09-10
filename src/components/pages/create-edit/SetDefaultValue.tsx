import { AddBasketType, BasketContentType } from "@/types/Basket";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";

interface Props {
  data: BasketContentType;
}

function SetDefaultValue({ data }: Props) {
  const { setValues } = useFormikContext<AddBasketType>();

  useEffect(() => {
    setValues({
      firstName: data.firstname,
      lastName: data.lastname,
      nationalID: data.nationalid,
      mobileNumber: data.mobilenumber,
      productName: data.productname,
      weightEntry: data.weightentry,
      weightExit: data.weightexit,
      basketNumbers: data.basketnumbers,
      entryDate: new Date(data.entrydate),
      exitDate: data.exitdate ? new Date(data.exitdate) : undefined,
    });
  }, [data]);

  return <></>;
}

export default SetDefaultValue;
