import { useState } from "react";
import { Aside } from "../UI/Aside/Aside";
import s from "./InstructionPage.module.css";
import { lorem } from "./../Utils/data";
export const InstructionPage = () => {
  const [asideLeft, setToggleAsideLeft] = useState(false);
  const [asideRight, setToggleAsideRight] = useState(false);

  const toggleLeft = () => setToggleAsideLeft(!asideLeft);
  const toggleRight = () => setToggleAsideRight(!asideRight);
  return (
    <>
      <Aside />
      <section className={s.InstructionPage}>
        <div className="InstructionPageContent">
          <h2>InstructionPage</h2>
          <p>{lorem}</p>
        </div>
      </section>
    </>
  );
};
