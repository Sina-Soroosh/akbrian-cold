export interface CheckboxProps {
  isChecked?: boolean;
  labelText?: string;
  containerStyle?: string;
  bgWhite?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  square_check?:boolean;
}
