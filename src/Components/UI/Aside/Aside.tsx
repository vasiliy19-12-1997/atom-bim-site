import { FC, useState } from "react";
import s from "./Aside.module.scss";
import { IAsideProps } from "../../Types/types";
export const Aside: FC<IAsideProps> = ({
  children,
  position,
  show,
  toggleShow,
}) => {
  return (
    <>
      <div className={`${s.Aside} ${show ? s.active : ""}`}>{children}</div>
      <button className={s.AsideButton} onClick={() => toggleShow()}>
        left
      </button>
    </>
  );
};
