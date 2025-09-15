export interface CustomerContentType {
  customerid: number;
  firstname: string;
  lastname: string;
  nationalcode: string;
  phone: string;
  productname: string;
  total_in?: string;
  total_out?: string;
}

export interface CreateCustomerType {
  firstName: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  productName: string;
}
