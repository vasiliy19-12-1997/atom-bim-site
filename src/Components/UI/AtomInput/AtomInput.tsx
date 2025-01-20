import { useState } from "react";
import s from "./AtomInput.module.css";
interface IAtomInput {
  value: string;
  onChange: () => void;
  placeholder: string;
  type: string;
}
export const AtomInput: React.FC<IAtomInput> = ({
  value,
  onChange,
  placeholder,
  type,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.1288 16.4016C13.854 17.4029 12.2467 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35787 6.35786 3 10.5 3C14.6421 3 18 6.35787 18 10.5C18 12.2467 17.4029 13.854 16.4016 15.1288L21 19.7272L19.7273 21L15.1288 16.4016ZM16.125 10.5C16.125 13.6066 13.6066 16.125 10.5 16.125C7.39344 16.125 4.87505 13.6066 4.87505 10.5C4.87505 7.3934 7.39344 4.875 10.5 4.875C13.6066 4.875 16.125 7.3934 16.125 10.5Z"
        fill="white"
      />
    </svg>
  );
  return (
    <div className={s.AtomInput}>
      {icon && <span className={s.AtomInputSearch}>{icon}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div className={s.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Search</h2>
            <input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              type={type}
              className={s.modalInput}
            />
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
