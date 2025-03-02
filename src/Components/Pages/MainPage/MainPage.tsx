import { FC } from "react";
import s from "./MainPage.module.scss";
import { SectionSite } from "./SectionsSite/SectionSite";
import { images } from "../../Assets/Images/Images";
export const MainPage: FC = () => {
  return (
    <div className={s.MainPage}>
      <section className={s.MainPageMain}>
        <div>
          <h1>Добро пожаловать в ATOM.BIM!</h1>
          <p>
            ATOM.BIM — веб-ресурс, который содержит требования к процессу
            информационного моделирования, кадровому составу и ресурсам,
            задействованным в BIM-проекте, а также конечной BIM-модели
          </p>
        </div>
        <div>
          <img
            id="licey6Image"
            src={images.licey6Image}
            alt="Лицей"
            width="800px"
          />
        </div>
      </section>
      <SectionSite />
      <section className={s.MainPageVideo}>
        <iframe
          src="https://rutube.ru/play/embed/b191fbe1f8ad0f6e3733401faba62c1c"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Rutube Video"
          className={s.videoContainer} // Уберите width и height из атрибутов!
        ></iframe>
      </section>
    </div>
  );
};
