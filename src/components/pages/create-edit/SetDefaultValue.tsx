import { CreateCustomerType, CustomerContentType } from "@/types/Customer";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";

interface Props {
  data: CustomerContentType;
}

function SetDefaultValue({ data }: Props) {
  const { setValues } = useFormikContext<CreateCustomerType>();

  useEffect(() => {
    setValues({
      firstName: data.firstname,
      lastName: data.lastname,
      nationalCode: data.nationalcode,
      phone: data.phone,
      productName: data.productname,
    });
  }, [data]);

  return <></>;
}

export default SetDefaultValue;
