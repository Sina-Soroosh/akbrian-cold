export interface AddBasketType {
  firstName: string;
  lastName: string;
  nationalID: string;
  mobileNumber: string;
  productName: string;
  weightEntry: number;
  weightExit: number;
  basketNumbers: string[];
  entryDate: Date;
  exitDate?: Date;
}

export interface BasketContentType {
  id: number;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  nationalid: string;
  productname: string;
  weightentry: number;
  weightexit: number;
  basketnumbers: string[];
  entrydate: string;
  exitdate: string | null;
  occupied: boolean;
}
