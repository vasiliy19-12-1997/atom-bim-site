import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom } from "../../Assets/Icons/icons.js";
import s from "./Header.module.css";
export const Header = () => {
  return (
    <header className={s.Header}>
      <span>{atom}</span>
      <div className={s.HeaderContent}>
        <ul>
          <li>
            <a href="/"> EIR</a>
          </li>
          <li>
            <a href="/">Инструкции</a>
          </li>
          <li>
            <a href="/">Библиотека</a>
          </li>
          <li>
            <a href="/">Видео</a>
          </li>
          <li>
            <a href="/">Faq</a>
          </li>
        </ul>
      </div>
      <AtomInput
        type="text"
        value={""}
        onChange={() => console.log("ionput")}
        placeholder="Поиск"
      />
      <AtomButton onClick={() => console.log("Open")}>Войти</AtomButton>
    </header>
  );
};
