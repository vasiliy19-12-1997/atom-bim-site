import { useState } from "react";
import { lorem } from "../../Utils/data";
import s from "./InstructionPage.module.scss";

export const InstructionPage = () => {
  const [isLeftAsideOpen, setIsLeftAsideOpen] = useState(true);

  const toggleLeftAside = () => {
    setIsLeftAsideOpen(!isLeftAsideOpen);
  };
  return (
    <section className={s.InstructionPage}>
      <aside
        className={`${s.InstructionPageLeftAside} ${
          isLeftAsideOpen ? s.open : s.close
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
      </aside>
      <button onClick={toggleLeftAside} className={s.InstructionPageLeftButton}>
        {isLeftAsideOpen ? "◀" : "▶"}
      </button>
      <div></div>
      <div className={s.InstructionPageContent}>
        <h2>Content</h2>
        <p>{lorem}</p>
      </div>
      <div></div>
      <aside className={s.RightAside}>
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
      </aside>
    </section>
  );
};
