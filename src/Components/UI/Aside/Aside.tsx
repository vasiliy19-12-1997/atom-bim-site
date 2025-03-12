import { FC } from "react";
import { IAsideProps } from "../../Types/types";

export const Aside: FC<IAsideProps> = ({ children, show, className }) => {
  return <aside className={className}>{children}</aside>;
};
