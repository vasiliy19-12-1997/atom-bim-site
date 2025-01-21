import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom } from "../../Assets/Icons/icons.js";
import s from "./Header.module.css";
export const Header = () => {
  return (
    <header className={s.Header}>
      <div>{atom}</div>
      <div className={s.Links}>
        <a href="/"> EIR</a>
        <a href="/">Инструкции</a>
        <a href="/">Библиотека</a>
        <a href="/">Видео</a>
        <a href="/">Faq</a>
        <AtomInput
          type="text"
          value={""}
          onChange={() => console.log("ionput")}
          placeholder="Поиск"
        />
      </div>
      <AtomButton onClick={() => console.log("Open")}>Войти</AtomButton>
    </header>
  );
};
