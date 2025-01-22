import React from "react";
import { search } from "../../Assets/Icons/icons";
import s from "./AtomInput.module.css";
interface IAtomInput {
  value: string;
  onChange: () => void;
  placeholder: string;
  type: string;
  className?: string;
  onClick: () => void;
}
export const AtomInput: React.FC<IAtomInput> = ({
  value,
  onChange,
  placeholder,
  type,
  onClick,
}) => {
  return (
    <div className={s.AtomInput}>
      {search && (
        <span onClick={onClick} className={s.AtomInputSearch}>
          {search}
        </span>
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        onClick={onClick}
      />
    </div>
  );
};
