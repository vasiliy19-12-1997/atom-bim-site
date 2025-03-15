import { FC } from "react";
import s from "./NumberestList.module.scss";
interface IListItem {
  title?: string;
  content?: string;
  children?: IListItem[];
}
interface INumberestList {
  items: IListItem[];
  parrentNumber?: string;
}
export const NumberestList: FC<INumberestList> = ({ items, parrentNumber }) => {
  return (
    <ol className={s.NumberestList}>
      {items.map((item, index) => {
        const currentNumber = parrentNumber
          ? `${parrentNumber}.${index + 1}`
          : `${index + 1}`;
        return (
          <li key={index} className={s.NumberestListItem}>
            {item.title && (
              <h2>
                {currentNumber}. {item.title}
              </h2>
            )}
            {item.content && (
              <p>
                {currentNumber}. {item.content}
              </p>
            )}
            {item.children && (
              <NumberestList
                items={item.children}
                parrentNumber={currentNumber}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
