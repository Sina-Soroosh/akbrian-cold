import React from "react";
import "./checkboxStyles.css";
import { CheckboxProps } from "./props";
import { cx } from "@/utils/cx";

const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  bgWhite,
  labelText,
  containerStyle,
  disabled,
  onChange,
  ...props
}) => {
  return (
    <label className={cx("container", containerStyle)}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          {...props}
          onChange={onChange}
        />
        <span className={`${bgWhite ? "checkmark-white" : "checkmark"}`}></span>
      </div>
      {labelText}
    </label>
  );
};

export default React.memo(Checkbox);
