import { FC, useEffect, useState } from "react";
import { fetchVideos } from "../../../API/API";
import { VideoList } from "./VideoList/VideoList";
import s from "./VideoPage.module.scss";
import { IVideoSection } from "../../Types/types";
export const VideoPage: FC = () => {
  const [sections, setSections] = useState<IVideoSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchVideos();
        setSections(data);
      } catch (error) {
        setError("Ошибка загрузки данных");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  if (loading) return <h1>LOADING...</h1>;
  if (error) return <h1>{error}</h1>;
  return (
    <section className={s.VideoPage}>
      <h1>Каталог видеоинструкций</h1>
      {sections.map((item) => (
        <VideoList sections={sections} category={item.category} />
      ))}
    </section>
  );
};
