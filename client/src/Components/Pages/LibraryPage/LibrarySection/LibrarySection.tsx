import { FC } from "react";
import { ILibrarySection } from "../../../Types/types";
import s from "./LibrarySectiion.module.scss";
export const LibrarySection: FC<ILibrarySection> = ({ category, items }) => {
  return (
    <>
      <article className={s.LibrarySection}>
        <h1>{category}</h1>
        <hr />
        <div className={s.Map}>
          {items.map((item, index) => (
            <div className={s.LibrarySectionCards}>
              <div className={s.Card} key={index}>
                <img src={item.image} alt="test" width={150} height={200} />
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  );
};
