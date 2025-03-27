import React from "react";
import { IModalProps } from "../../Types/types";
import s from "./Modal.module.scss";

const Modal: React.FC<IModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={s.Modal} onClick={onClose}>
      <div className={s.ModalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
