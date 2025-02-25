import React from "react";
import { lightSearch, search } from "../../Assets/Icons/icons";
import smallStyles from "./AtomInput.module.scss";
import modalStyles from "./AtomInputModal.module.scss";
import submitStyles from "./AtomInputSubmit.module.scss";
import { IAtomInputProps } from "../../Types/types";
const styleModule = {
  small: smallStyles,
  modal: modalStyles,
  submit: submitStyles,
};
export const AtomInput: React.FC<IAtomInputProps> = ({
  value,
  onChange,
  placeholder,
  type,
  onClick,
  module,
}) => {
  const styles = styleModule[module];
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
        autoFocus={true}
        className={styles.AtomInputInput}
      />
    </div>
  );
};
