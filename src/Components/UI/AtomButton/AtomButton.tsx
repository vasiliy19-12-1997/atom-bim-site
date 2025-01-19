import s from "./AtomButton.module.css";
interface IAtomButton {
  children: React.ReactNode;
  onClick: () => void;
}
export const AtomButton: React.FC<IAtomButton> = ({ children, onClick }) => {
  return (
    <div>
      <button className={s.AtomButton} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};
