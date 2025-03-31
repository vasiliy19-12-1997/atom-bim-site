import { FC } from "react";
import s from "./MainPage.module.scss";
import { SectionSite } from "./SectionsSite/SectionSite";
import { images } from "../../Assets/Images/Images";
import { Models } from "./Models/Models";
import { ImageTrack } from "./ImageTrack/ImageTrack";
export const MainPage: FC = () => {
  return (
    <section className={s.MainPage}>
      <article className={s.MainPageMain}>
        <div>
          <h1>Добро пожаловать в ATOM.BIM!</h1>
          <p>
            ATOM.BIM — веб-ресурс, который содержит требования к процессу
            информационного моделирования, кадровому составу и ресурсам,
            задействованным в BIM-проекте, а также конечной BIM-модели
          </p>
        </div>
        <div>
          <ImageTrack
            frontSrc={images.licey6Image}
            backSrc={images.liceyPodl2}
            alt={"atom projects"}
          />
        </div>
      </article>
      <SectionSite />
      <article className={s.MainPageVideo}>
        <iframe
          src="https://rutube.ru/play/embed/b191fbe1f8ad0f6e3733401faba62c1c"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Rutube Video"
          className={s.videoContainer}
        ></iframe>
      </article>
      <Models />
    </section>
  );
};
