import bakin2Image from "../../../Assets/Images/bakin2.png";
import Group655Image from "../../../Assets/Images/Group 655_2.png";
import Group11767Image from "../../../Assets/Images/Group 11767_2.png";
import Group11787Image from "../../../Assets/Images/Group 11787_2.png";
import infoImage from "../../../Assets/Images/info.png";
import licey24Image from "../../../Assets/Images/licey_24.jpg";
import licey6Image from "../../../Assets/Images/licey6.jpg";
import prostorMImage from "../../../Assets/Images/prostor_m.png";
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
          <img src={infoImage} alt="info" />
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
          <img src={infoImage} alt="info" />
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
          <img src={infoImage} alt="info" />
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
          <img src={infoImage} alt="info" />
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
          <img src={infoImage} alt="info" />
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
          <img src={infoImage} alt="info" />
          <img src={Group11787Image} alt="eir" />
        </div>
      </div>
    </section>
  );
};
