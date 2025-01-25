import React from "react";
import { IAsideProps } from "../../Types/types";

export const Aside: React.FC<IAsideProps> = ({
  position,
  show,
  toggleShow,
}) => {
  return (
    <>
      <button className={`toggle-aside ${position}`} onClick={toggleShow}>
        {position === "left" ? "←" : "→"}
      </button>
      <aside className={`aside ${position} ${show ? "show" : ""}`}>
        <h2>{position === "left" ? "Left Aside" : "Right Aside"}</h2>
      </aside>
      {show && <div className="modal-backdrop" onClick={toggleShow}></div>}
    </>
  );
};
