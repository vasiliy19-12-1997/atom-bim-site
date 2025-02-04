import { useState } from "react";
import { lorem } from "./../Utils/data";
import s from "./InstructionPage.module.scss";
import { Aside } from "../UI/Aside/Aside";
export const InstructionPage = () => {
  const [asideLeft, setToggleAsideLeft] = useState(false);
  const [asideRight, setToggleAsideRight] = useState(false);
  const toggleLeft = () => setToggleAsideLeft(!asideLeft);
  const toggleRight = () => setToggleAsideRight(!asideRight);
  return (
    <div className={s.InstructionPage}>
      <div className={s.InstructionPageDiv}>
        <Aside />
        <section className={s.InstructionPageDivSection}>
          <div className={s.InstructionPageDivSectionContent}>
            <h2>InstructionPage</h2>
            <p>{lorem}</p>
          </div>
        </section>
      </div>
      <div className={s.InstructionPageRightBlock}>
        <ol>
          <li>
            <a href="/">Описание семейства</a>
          </li>
          <li>
            <a href="/">Общие требования</a>
          </li>
          <li>
            <a href="/">Правила наименования</a>
          </li>
          <li>
            <a href="/">Правила маркировки</a>
          </li>
          <li>
            <a href="/">Параметры типоразмера</a>
          </li>
          <li>
            <a href="/">Структура слоев</a>
          </li>
          <li>
            <a href="/">Параметры экземпляра</a>
          </li>
        </ol>
      </div>
    </div>
  );
};
