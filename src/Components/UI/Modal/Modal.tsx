// Modal.tsx
import React from "react";
import { IModalProps } from "../../Types/types";
import styles from "./Modal.module.css";

const Modal: React.FC<IModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
