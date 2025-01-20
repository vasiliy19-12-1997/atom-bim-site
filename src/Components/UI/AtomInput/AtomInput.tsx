import { useState } from "react";
import s from "./AtomInput.module.css";
import { search } from "../../Assets/Icons/icons";
interface IAtomInput {
  value: string;
  onChange: () => void;
  placeholder: string;
  type: string;
  className?: string;
}
export const AtomInput: React.FC<IAtomInput> = ({
  value,
  onChange,
  placeholder,
  type,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={s.AtomInput}>
      {search && <span className={s.AtomInputSearch}>{search}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        onClick={() => setIsModalOpen(true)}
        className={className}
      />
      {isModalOpen && (
        <div className={s.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              type={type}
              className={s.modalInput}
            />
            <p>Начните ввод, чтобы увидеть резульаты поиска</p>
          </div>
        </div>
      )}
    </div>
  );
};
