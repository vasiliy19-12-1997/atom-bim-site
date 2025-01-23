import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom } from "../../Assets/Icons/icons.js";
import s from "./Header.module.css";
import { useState } from "react";

export const Header = () => {
  const [value, setValue] = useState(false);
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
