import React from "react";
import { search } from "../../Assets/Icons/icons";
import s from "./AtomInput.module.css";
import { IAtomInput } from "../../Types/types";
export const AtomInput: React.FC<IAtomInput> = ({
  value,
  onChange,
  placeholder,
  type,
}) => {
  return (
    <div className={s.AtomInput}>
      {search && <span className={s.AtomInputSearch}>{search}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
};
