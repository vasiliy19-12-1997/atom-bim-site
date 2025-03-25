import { useState } from "react";
import { Aside } from "../../UI/Aside/Aside";
import { AtomInput } from "../../UI/AtomInput/AtomInput";
import s from "./EIRPage.module.scss";
import { Link } from "react-router-dom";
import { NumberestList } from "./NumberestList/NumberestList";
import { eirData } from "../../Data/eirArray";
export const EIRPage = () => {
  const [value, setValue] = useState("");
  const [isLeftAside, setIsLeftAside] = useState(true);

  const toggleLeftAside = () => {
    setIsLeftAside(!isLeftAside);
  };
  return (
    <section className={s.EIRPage}>
      <div className={s.EIRPageContainer}>
        <div></div>
        <Aside
          show={isLeftAside}
          className={`${s.Aside} ${isLeftAside ? s.open : s.close}`}
        >
          <AtomInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            module="small"
            type="text"
          />
          <ul>
            <li>
              EIR
              <ol>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
              </ol>
            </li>
            <li>
              Приложения
              <ol>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
              </ol>
            </li>
          </ul>
        </Aside>
        <button onClick={toggleLeftAside} className={s.OpenAside}>
          {isLeftAside ? "◀" : "▶"}
        </button>
        <article className={s.EIRPageContainerContent}>
          <NumberestList items={eirData} />
        </article>
      </div>
    </section>
  );
};
