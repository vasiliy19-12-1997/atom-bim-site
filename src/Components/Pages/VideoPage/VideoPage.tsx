import { FC } from "react";
import s from "./VideoPage.module.scss";
import { atomVideoArray } from "../../Data/atomVideoArray";
import { VideoList } from "./VideoList/VideoList";
export const VideoPage: FC = () => {
  return (
    <section className={s.VideoPage}>
      <h1>Каталог видеоинструкций</h1>
      {atomVideoArray.map((item) => (
        <VideoList category={item.category} />
      ))}
    </section>
  );
};
