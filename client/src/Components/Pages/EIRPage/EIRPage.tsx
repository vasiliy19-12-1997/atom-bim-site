import { useState } from "react";
import { Aside } from "../../UI/Aside/Aside";
import { AtomInput } from "../../UI/AtomInput/AtomInput";
import s from "./EIRPage.module.scss";
import { Link } from "react-router-dom";
import { NumberestList } from "./NumberestList/NumberestList";
import { eirData } from "../../Data/eirArray";
import { CollapsibleSection } from "../../UI/CollapsibleSection/CollapsibleSection";
export const EIRPage = () => {
  const [value, setValue] = useState("");
  const [isLeftAside, setIsLeftAside] = useState(true);

  const toggleLeftAside = () => setIsLeftAside(!isLeftAside);

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
            <CollapsibleSection title="EIR">
              <>
                <li>
                  <Link to="">Общие положения</Link>
                </li>
                <li>
                  <Link to="">Термины</Link>
                </li>
                <li>
                  <Link to="">Требования к програмному обеспечению</Link>
                </li>
                <li>
                  <Link to="">Общие требоавния к модели</Link>
                </li>
                <li>
                  <Link to="">Запрещенные действия</Link>
                </li>
                <li>
                  <Link to="">Правила наименования</Link>
                </li>
                <li>
                  <Link to="">Рабочие наборы</Link>
                </li>
                <li>
                  <Link to="">Требования к файлам Civil 3D</Link>
                </li>
                <li>
                  <Link to="">Контроль качества ЦИМ</Link>
                </li>
                <li>
                  <Link to="">Обмен данными через АТОМ. Облако</Link>
                </li>
              </>
            </CollapsibleSection>
            <CollapsibleSection title="Приложения">
              <>
                <li>
                  <Link to="">Матрица наполнения</Link>
                </li>
                <li>
                  <Link to="">Матрица коллизий</Link>
                </li>
                <li>
                  <Link to="">Идентификация материалов</Link>
                </li>
                <li>
                  <Link to="">Идентификация элементов</Link>
                </li>
                <li>
                  <Link to="">Типы инженерных систем</Link>
                </li>
                <li>
                  <Link to="">Этапы моделирования</Link>
                </li>
              </>
            </CollapsibleSection>
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
