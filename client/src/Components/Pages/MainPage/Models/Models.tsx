import { images } from "../../../Assets/Images/Images";
import s from "./Models.module.scss";
export const Models = () => {
  return (
    <section className={s.Models}>
      <h2>Построеные модели</h2>
      <div>
        <article className={s.ModelsContainer} id="item1">
          <div className={s.ModelsContainerBlock}>
            <h3>«Просторы» — микрорайон на берегу Исети близ Уктусских гор</h3>
            <p>
              Модель содержит более 2 миллионов элементов. Детализация модели
              соответствует наивысшей категории.
            </p>
            <ul className={s.specsList}>
              <li>
                Площадь застройки: <strong>1354,4 м²</strong>
              </li>
              <li>
                Этажность: <strong>27 эт.</strong>
              </li>
              <li>
                Строительный объем: <strong>70 430,2 м³</strong>
              </li>
              <li>
                Площадь квартир: <strong>12 233,52 м²</strong>
              </li>
              <li>
                Расчетная численность жителей: <strong>408 чел.</strong>
              </li>
            </ul>
          </div>
          <div>
            <img
              width="377"
              height="527"
              src={images.prostorMImage}
              alt="prostory"
            />
          </div>
        </article>
        <article className={s.ModelsContainer} id="item2">
          <div>
            <img
              width="377"
              height="527"
              src={images.bakin2Image}
              alt="bakinskix"
            />
          </div>
          <div className={s.ModelsContainerBlock}>
            <h3>ЖК на Бакинских Комиссаров</h3>
            <p>
              Жилой дом на Бакинских Комиссаров, 101 - это современное здание
              переменной этажности на месте расселенного частного сектора;
              настоящая “изюминка” микрорайона Уралмаш
            </p>
            <ul className={s.specsList}>
              <li>
                Площадь застройки: <strong> 11 280 м2</strong>
              </li>
              <li>
                Этажность: <strong> 9-21-14-27-14-27-9 эт.</strong>
              </li>
              <li>
                Строительный объем: <strong>311 130 м3</strong>
              </li>
              <li>
                Площадь квартир: <strong>49 500 м2</strong>
              </li>
              <li>
                Расчетная численность жителей: <strong>1 614 чел.</strong>
              </li>
            </ul>
          </div>
        </article>
        <article className={s.ModelsContainer} id="item3">
          <div className={s.ModelsContainerBlock}>
            <h3>Губернаторский лицей</h3>
            <strong>Проетк выполнен полностью по BIM технологиям</strong>
            <ul className={s.specsList}>
              <li>126 файлов моделей, из которых было получено</li>
              <li>160 комплектов рабочей документации</li>
              <li>Только для раздела ТХ было создано более</li>
              <li>750 уникальных семейств</li>
            </ul>
          </div>
          <div>
            <img
              width="1000"
              height="527"
              src={images.licey24Image}
              alt="licey"
            />
          </div>
        </article>
      </div>
    </section>
  );
};
