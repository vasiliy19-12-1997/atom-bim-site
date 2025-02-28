import { FC } from "react";
import s from "./MainPage.module.scss";
import { SectionSite } from "./SectionsSite/SectionSite";

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
      <SectionSite />
      <iframe
        src="https://rutube.ru/play/embed/b191fbe1f8ad0f6e3733401faba62c1c"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        width={1268}
        height={768}
        title="Rutube Video"
      ></iframe>
    </div>
  );
};
