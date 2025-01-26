import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom, burger } from "../../Assets/Icons/icons.js";
import s from "./Header.module.css";
import { useState } from "react";
interface IHeaderProps {
  openModal: () => void;
}
export const Header: React.FC<IHeaderProps> = ({ openModal }) => {
  const [value, setValue] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };
  const addActive = () => {
    setIsActive(!isActive);
  };
  return (
    <header className={s.Header}>
      <div className={s.BurgerMenu} onClick={toggleBurger}>
        {burger}
      </div>
      <span>{atom}</span>
      <div className={s.HeaderContent}>
        <ul
          className={`${s.HeaderLinks} ${
            isBurgerOpen ? s.HeaderLinksOpen : ""
          }`}
        >
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Поиск"
          onClick={openModal}
        />
      </div>
      <AtomButton onClick={() => console.log("Open")}>Войти</AtomButton>
    </header>
  );
};
