import s from "./Test.module.scss";
export const Test = () => {
  return (
    <div className={s.Test}>
      <div className={`${s.Card} ${s.card1}`} id="card1">
        1
      </div>
      <div className={`${s.Card} ${s.card2}`} id="card2">
        2
      </div>
      <div className={`${s.Card} ${s.card3}`} id="card3">
        3
      </div>
    </div>
  );
};
