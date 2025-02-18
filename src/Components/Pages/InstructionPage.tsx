import React, { useState } from "react";
import s from "./InstructionPage.module.scss";
import { lorem } from "../Utils/data";

export const InstructionPage = () => {
  const [isLeftAsideOpen, setIsLeftAsideOpen] = useState(false);

  const toggleLeftAside = () => {
    setIsLeftAsideOpen(!isLeftAsideOpen);
  };

  return (
    <section className={s.InstructionPage}>
      <div className={s.InstructionPageBlock}>
        <div
          className={`${s.InstructionPageBlockLeftAside} ${
            isLeftAsideOpen ? s.open : ""
          }`}
        >
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
        <button
          className={s.InstructionPageBlockLeftAsideButton}
          onClick={toggleLeftAside}
        >
          Toggle Menu
        </button>
        <div></div>
        <article className={s.InstructionPageBlockArticle}>
          <div className={s.InstructionPageBlockArticleContent}>
            <h1>InstructionPage</h1>
            <p>{lorem}</p>
          </div>
        </article>
      </div>
      <div className={s.InstructionPageRightAside}>
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
    </section>
  );
};
