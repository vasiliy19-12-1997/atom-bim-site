import { useState } from "react";
import { Link } from "react-router-dom";
import { AtomButton } from "../AtomButton/AtomButton";
import { AtomInput } from "../AtomInput/AtomInput";
import { atom, burger } from "../../Assets/Icons/icons.js";
import s from "./Header.module.scss";
import { IHeaderProps } from "../../Types/types";

export const Header: React.FC<IHeaderProps> = ({
  openModal,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [value, setValue] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [ActiveLink, setActiveLink] = useState<string | null>("");

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };
  const toggleActiveLink = (path: string) => {
    setActiveLink(path);
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
            <Link
              onClick={() => toggleActiveLink("/eir")}
              className={`${s.Link} ${
                ActiveLink === "/eir" ? s.open : s.close
              }`}
              to="/eir"
            >
              EIR
            </Link>
          </li>
          <li>
            <Link
              onClick={() => toggleActiveLink("/instruction")}
              className={`${s.Link} ${
                ActiveLink === "/instruction" ? s.open : s.close
              }`}
              to="/instruction"
            >
              Инструкции
            </Link>
          </li>
          <li>
            <Link
              onClick={() => toggleActiveLink("/library")}
              className={`${s.Link} ${
                ActiveLink === "/library" ? s.open : s.close
              }`}
              to="/library"
            >
              Библиотека
            </Link>
          </li>
          <li>
            <Link
              onClick={() => toggleActiveLink("/video")}
              className={`${s.Link} ${
                ActiveLink === "/video" ? s.open : s.close
              }`}
              to="/video"
            >
              Видео
            </Link>
          </li>
          <li>
            <Link
              onClick={() => toggleActiveLink("/faq")}
              className={`${s.Link} ${
                ActiveLink === "/faq" ? s.open : s.close
              }`}
              to="/faq"
            >
              Faq
            </Link>
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
