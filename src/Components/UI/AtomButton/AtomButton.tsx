import s from "./AtomButton.module.scss";
type ButtonType = "button" | "submit" | "reset";
interface IAtomButton {
  children: React.ReactNode;
  onClick: () => void;
  type: ButtonType;
}
export const AtomButton: React.FC<IAtomButton> = ({
  children,
  onClick,
  type,
}) => {
  return (
    <div>
      <button className={s.AtomButton} onClick={onClick} type="button">
        {children}
      </button>
    </div>
  );
};
