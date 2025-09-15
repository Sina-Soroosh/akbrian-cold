import { CustomerContentType } from "@/types/Customer";
import { create } from "zustand";
import { cloneDeep } from "lodash";
import { TransactionContentType } from "@/types/Transaction";

interface CustomerStore {
  refetchHandler: () => void;
  isLoading: boolean;
  customer: CustomerContentType | null;
  transactions: TransactionContentType[];
  totalIn: number;
  totalOut: number;
  myOccupiedBaskets: { [key: string]: string[] };
  occupiedBaskets: { [key: string]: string[] };
  isAddNew: boolean;
  typeNew: "IN" | "OUT";
}

interface CustomerStoreWithActions extends CustomerStore {
  setValues: (body: Partial<CustomerStore>) => void;
  resetAll: () => void;
}

const init: CustomerStore = {
  refetchHandler: () => {},
  isLoading: false,
  customer: null,
  transactions: [],
  myOccupiedBaskets: {},
  occupiedBaskets: {},
  totalIn: 0,
  totalOut: 0,
  isAddNew: false,
  typeNew: "IN",
};

const useCustomer = create<CustomerStoreWithActions>((set) => ({
  ...cloneDeep(init),
  setValues: (body) => set({ ...body }),
  resetAll: () => set({ ...cloneDeep(init) }),
}));

export default useCustomer;
