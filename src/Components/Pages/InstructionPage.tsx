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
    <section className={s.InstructionPage}>
      <div className={s.InstructionPageDiv}>
        <Aside position="left" show={asideLeft} toggleShow={toggleLeft}>
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
        </Aside>
        <div></div>
        <article className={s.InstructionPageDivSection}>
          <div className={s.InstructionPageDivSectionContent}>
            <h1>InstructionPage</h1>
            <p>{lorem}</p>
          </div>
        </article>
      </div>

      <Aside position="right" show={asideRight} toggleShow={toggleRight}>
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
      </Aside>
    </section>
  );
};
