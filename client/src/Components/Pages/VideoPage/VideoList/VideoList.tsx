import { FC, useEffect, useRef, useState } from "react";
import { IVideoListProps } from "../../../Types/types";
import s from "./VideoList.module.scss";
export const VideoList: FC<IVideoListProps> = ({ sections, category }) => {
  const selectedCategory = sections.find((item) => item.category === category);

  return (
    <article className={s.VideoList}>
      <h2>{selectedCategory?.category}</h2>

      <hr />
      <div className={s.videoGrid}>
        {selectedCategory?.urls.map((url, index) => (
          <LazyVideo
            key={index}
            url={url}
            text={selectedCategory?.text?.[index]}
          />
        ))}
      </div>
    </article>
  );
};

const LazyVideo: FC<{ url: string; text?: string }> = ({ url, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Отключаем после загрузки
        }
      },
      { threshold: 0.1 } // 10% видео попадает в экран — загружаем
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={videoRef} className={s.videoContainer}>
      {isVisible ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Rutube Video"
          src={url}
          loading="lazy"
        ></iframe>
      ) : (
        <p className={s.placeholder}>Загрузка видео...</p>
      )}
      {text && <p>{text}</p>}
    </div>
  );
};
