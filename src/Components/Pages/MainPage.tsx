import { FC } from "react";
import s from "./MainPage.module.scss";
import eirImage from "../Assets/Images/section_eir.png";
import infoImage from "../Assets/Images/info.png";
export const MainPage: FC = () => {
  return (
    <div className={s.MainPage}>
      <section>
        <h1>Добро пожаловать в ATOM.BIM!</h1>
        <p>
          ATOM.BIM — веб-ресурс, который содержит требования к процессу
          информационного моделирования, кадровому составу и ресурсам,
          задействованным в BIM-проекте, а также конечной BIM-модели
        </p>
      </section>
      <section>
        <h2>Разделы сайта</h2>
        <div className={s.MainPage}>
          <h3>EIR</h3>
          <p>
            Корпоративный стандарт цифрового моделирования объектов капитального
            строительства.
          </p>
          <div>
            <img src={infoImage} alt="info" />
            <img src={eirImage} alt="eir" />
          </div>
        </div>
        <div>
          <h3>EIR</h3>
          <p>
            Корпоративный стандарт цифрового моделирования объектов капитального
            строительства.
          </p>
          <div>
            <img src={infoImage} alt="info" />
            <img src={eirImage} alt="eir" />
          </div>
        </div>
      </section>
    </div>
  );
};
