import Group11767Image from "../../../Assets/Images/Group 11767_2.png";
import Group11787Image from "../../../Assets/Images/Group 11787_2.png";
import Group655Image from "../../../Assets/Images/Group 655_2.png";
import infoImage from "../../../Assets/Images/info.png";
import eirImage from "../../../Assets/Images/section_eir.png";
import pluginImage from "../../../Assets/Images/section_plugin.png";
import testImage from "../../../Assets/Images/section_test.png";
import s from "./SectionSite.module.scss";
export const SectionSite = () => {
  return (
    <section className={s.SectionSite}>
      {/* <h2>Разделы сайта</h2> */}
      <div className={s.SectionSiteItem}>
        <h3>EIR</h3>
        <p>
          Корпоративный стандарт цифрового моделирования объектов капитального
          строительства.
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={eirImage} alt="eir" />
        </div>
      </div>
      <div className={s.SectionSiteItem}>
        <h3>Библиотека</h3>
        <p>
          Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные
          семейства. плагины по автоматизации проектирования
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={Group11787Image} alt="eir" />
        </div>
      </div>
      <div className={s.SectionSiteItem}>
        <h3>Библиотека</h3>
        <p>
          Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные
          семейства. плагины по автоматизации проектирования
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={Group11767Image} alt="eir" />
        </div>
      </div>
      <div className={s.SectionSiteItem}>
        <h3>Библиотека</h3>
        <p>
          Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные
          семейства. плагины по автоматизации проектирования
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={Group655Image} alt="eir" />
        </div>
      </div>
      <div className={s.SectionSiteItem}>
        <h3>Библиотека</h3>
        <p>
          Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные
          семейства. плагины по автоматизации проектирования
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={pluginImage} alt="eir" />
        </div>
      </div>
      <div className={s.SectionSiteItem}>
        <h3>Библиотека</h3>
        <p>
          Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные
          семейства. плагины по автоматизации проектирования
        </p>
        <div>
          <img id="infoImage" src={infoImage} alt="info" />
          <img src={testImage} alt="eir" />
        </div>
      </div>
    </section>
  );
};
