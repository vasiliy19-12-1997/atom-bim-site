import s from "./Footer.module.css";
import { atom } from "../../Assets/Icons/icons";
export const Footer = () => {
  return (
    <footer className={s.Footer}>
      <div className={s.FooterLinks}>
        <ul>
          <li>
            <a href="/">EIR</a>
          </li>
          <li>
            <a href="/">Инструкции</a>
          </li>
          <li>
            <a href="/">Этапы моделирования</a>
          </li>
          <li>
            <a href="/">Библиотека</a>
          </li>
          <li>
            <a href="/">Тесты</a>
          </li>
        </ul>
      </div>
      <div className={s.FooterInfo}>
        <div className={s.FooterInfoText}>
          <p>© АО «Корпорация «АТОМСТРОЙКОМПЛЕКС», 2024</p>
          <p>Екатеринбург, ул. Белинского, 39</p>
        </div>
        <span>{atom}</span>
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
