import React from "react";

interface AsideProps {
  position: "left" | "right";
  show: boolean;
  toggleShow: () => void;
}

export const Aside: React.FC<AsideProps> = ({ position, show, toggleShow }) => {
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
