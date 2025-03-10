import { IAtomButton } from "../../Types/types";
import s from "./AtomButton.module.scss";

export const AtomButton: React.FC<IAtomButton> = ({
  children,
  onClick,
  type,
}) => {
  return (
    <div>
      <button className={s.AtomButton} onClick={onClick} type={type}>
        {children}
      </button>
    </div>
  );
};
