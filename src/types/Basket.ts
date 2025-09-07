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
