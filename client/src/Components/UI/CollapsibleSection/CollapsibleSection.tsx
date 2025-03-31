import { FC, ReactNode, useState } from "react";
import s from "./CollapsibleSection.module.scss";
interface ICollapsibleSection {
  title: string;
  children: ReactNode;
}
export const CollapsibleSection: FC<ICollapsibleSection> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSection = (section: string) => {
    setIsOpen(!isOpen);
  };
  return (
    <li key={title}>
      <button onClick={() => toggleSection(title)} className={s.SectionToggle}>
        {title} {isOpen ? "▲" : "▼"}
      </button>
      <ol className={`${s.SubMenu} ${isOpen ? s.open : ""}`}>{children}</ol>
    </li>
  );
};
