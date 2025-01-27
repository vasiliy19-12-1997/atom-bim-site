import { useState } from "react";
import s from "./Aside.module.css";
export const Aside = () => {
  const [isAside, setIsAside] = useState(false);
  const toggleAside = () => {
    setIsAside(!isAside);
  };
  return (
    <>
      <div className={`${s.Aside} ${isAside ? s.active : ""}`}>
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
      </div>
      <button onClick={toggleAside}>left</button>
    </>
  );
};
