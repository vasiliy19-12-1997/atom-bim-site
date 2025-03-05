import { FC } from "react";
import s from "./VideoPage.module.scss";
import { atomVideo } from "../../Utils/atomVideo";
import { VideoList } from "./VideoList/VideoList";
export const VideoPage: FC = () => {
  return (
    <div className={s.VideoPage}>
      <h1>Каталог видеоинструкций</h1>
      {atomVideo.map((item) => (
        <VideoList category={item.category} />
      ))}
    </div>
  );
};
