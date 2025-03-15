import React, { useState } from "react";
import s from "./ImageTrack.module.scss";

interface ImageTrackProps {
  frontSrc: string;
  backSrc: string;
  alt: string;
}

export const ImageTrack: React.FC<ImageTrackProps> = ({
  frontSrc,
  backSrc,
  alt,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setPosition({ x, y });

    const backgroundX = (x / width) * 100;
    const backgroundY = (y / height) * 100;

    setBackgroundPosition({ x: backgroundX, y: backgroundY });
  };

  return (
    <div
      className={s.ImageTrack}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img src={frontSrc} alt={alt} className={s.ImageTrackFront} />
      <img src={backSrc} alt={alt} className={s.ImageTrackBack} />
      {isZoomed && (
        <div
          className={s.ImageTrackLens}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            backgroundImage: `url(${backSrc})`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
          }}
        />
      )}
    </div>
  );
};
