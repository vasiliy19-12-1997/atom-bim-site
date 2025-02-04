import { useState } from "react";
import s from "./Aside.module.scss";
export const Aside = () => {
  const [isAside, setIsAside] = useState(true);
  const toggleAside = () => {
    setIsAside(!isAside);
  };
  return (
    <>
      <div className={`${s.Aside} ${isAside ? s.active : ""}`}>
        <nav>
          <ul>
            <li>
              <a href="/">СОД</a>
            </li>
            <li>
              <a href="/">Revit Общие</a>
            </li>
            <li>
              <a href="/">Revit АР</a>
            </li>
            <li>
              <a href="/">Revit КЖ</a>
            </li>
            <li>
              <a href="/">Revit ОВ/ВК</a>
            </li>
            <li>
              <a href="/">Revit ЭЛ/СС</a>
            </li>
            <li>
              <a href="/">Civil 3D</a>
            </li>
            <li>
              <a href="/">AutoCad</a>
            </li>
            <li>
              <a href="/">Tangl Value</a>
            </li>
          </ul>
        </nav>
      </div>
      <button className={s.AsideButton} onClick={toggleAside}>
        left
      </button>
    </>
  );
};
