import React from "react";
import { lightSearch, search } from "../../Assets/Icons/icons";
import s from "./AtomInput.module.css";
import m from "./AtomInputModal.module.css";
interface IAtomInputProps {
  value: string;
  onChange?: () => void;
  placeholder: string;
  type: string;
  onClick: () => void;
  module?: "s" | "m";
}
export const AtomInput: React.FC<IAtomInputProps> = ({
  value,
  onChange,
  placeholder,
  type,
  onClick,
  module = "s",
}) => {
  const styles = module === "s" ? s : m;
  return (
    <div className={styles.AtomInput}>
      {search && (
        <span onClick={onClick} className={styles.AtomInputSearch}>
          {search}
        </span>
      )}
      <span className={styles.AtomInputLightSearch}>{lightSearch}</span>
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
