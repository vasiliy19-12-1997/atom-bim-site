import s from "./LibraryPage.module.scss";
import { LibrarySection } from "./LibrarySection/LibrarySection";
export const LibraryPage = () => {
  return (
    <section className={s.LibraryPage}>
      <div className={s.LibraryPageMain}>
        <LibrarySection />
      </div>
    </section>
  );
};
