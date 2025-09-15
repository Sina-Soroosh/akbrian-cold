export interface TransactionContentType {
  transactionid: number;
  customerid: number;
  transactiontype: "IN" | "OUT";
  transactiondate: string;
  weight: string;
  hall: string;
  baskets: string[];
}

export interface AddTransactionType {
  customerId: number;
  transactionType: "IN" | "OUT";
  weight: number;
  hall: string;
  basketNumbers: string[];
  transactionDate: Date;
}
