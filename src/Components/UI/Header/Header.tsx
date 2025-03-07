import { useState } from "react";
import { Link } from "react-router-dom";
import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom, burger } from "../../Assets/Icons/icons.js";
import s from "./Header.module.scss";

interface IHeaderProps {
  openModal: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const Header: React.FC<IHeaderProps> = ({
  openModal,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [value, setValue] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <header className={s.Header}>
      <div className={s.BurgerMenu} onClick={toggleBurger}>
        {burger}
      </div>
      <Link to="/">
        <span>{atom}</span>
      </Link>
      <div className={s.HeaderContent}>
        <ul
          className={`${s.HeaderLinks} ${
            isBurgerOpen ? s.HeaderLinksOpen : ""
          }`}
        >
          <li>
            <Link to="/eir">EIR</Link>
          </li>
          <li>
            <Link to="/instruction">Инструкции</Link>
          </li>
          <li>
            <Link to="/library">Библиотека</Link>
          </li>
          <li>
            <Link to="/video">Видео</Link>
          </li>
          <li>
            <Link to="/faq">Faq</Link>
          </li>
        </ul>
        <AtomInput
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Поиск"
          onClick={openModal}
          module="small"
        />
      </div>
      <AtomButton
        type="button"
        onClick={() => setIsAuthenticated(!isAuthenticated)}
      >
        {isAuthenticated ? "Выйти" : "Войти"}
      </AtomButton>
    </header>
  );
};
