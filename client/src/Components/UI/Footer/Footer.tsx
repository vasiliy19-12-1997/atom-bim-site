import s from "./Footer.module.scss";
import { atom } from "../../Assets/Icons/icons";
import { link } from "../../Assets/Icons/icons";
import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <footer className={s.Footer}>
      <div className={s.FooterLinks}>
        <ul>
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
        <div className={s.FooterLinksSite}>
          <a href="/">Сайт компании</a>
          <span>{link}</span>
        </div>
      </div>
      <div className={s.FooterInfo}>
        <div className={s.FooterInfoText}>
          <p>© АО «Корпорация «АТОМСТРОЙКОМПЛЕКС», 2024</p>
          <span>{atom}</span>
          <p>Екатеринбург, ул. Белинского, 39</p>
        </div>
      </div>

      <div className={s.FooterBottom}>
        <p>
          Любые материалы, файлы и сервисы, содержащиеся на сайте, не могут быть
          воспроизведены в какой-либо форме, каким-либо способом, полностью или
          частично без предварительного письменного разрешения Компании, за
          исключением случаев, указанных в Соглашении об использовании сайта.
        </p>
        <ul>
          <li>
            <a href="/">Соглашение об использовании сайта</a>
            <a href="/">Политика в отношении обработки персональных данных</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
