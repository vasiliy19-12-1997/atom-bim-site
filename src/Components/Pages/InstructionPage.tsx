import { useState } from "react";
import { lorem } from "./../Utils/data";
import s from "./InstructionPage.module.scss";
import { Aside } from "../UI/Aside/Aside";
export const InstructionPage = () => {
  const [asideLeft, setToggleAsideLeft] = useState(false);
  const [asideRight, setToggleAsideRight] = useState(false);
  const toggleLeft = () => setToggleAsideLeft(!asideLeft);
  const toggleRight = () => setToggleAsideRight(!asideRight);
  return (
    <>
      <div className={s.InstructionPage}>
        <Aside />
        <section className={s.InstructionPageSection}>
          <div className="InstructionPageContent">
            <h2>InstructionPage</h2>
            <p>{lorem}</p>
          </div>
        </section>
      </div>
    </>
  );
};
