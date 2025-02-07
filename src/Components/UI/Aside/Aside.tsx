import { FC, useState } from "react";
import s from "./Aside.module.scss";
import { IAsideProps } from "../../Types/types";
export const Aside: FC<IAsideProps> = ({
  children,
  position,
  show,
  toggleShow,
}) => {
  const [isAside, setIsAside] = useState(true);
  const toggleAside = () => {
    setIsAside(!isAside);
  };
  return (
    <>
      <div className={`${s.Aside} ${isAside ? s.active : ""}`}>{children}</div>
      <button className={s.AsideButton} onClick={toggleAside}>
        left
      </button>
    </>
  );
};
