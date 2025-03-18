import { useEffect, useState } from "react";
import s from "./LibraryPage.module.scss";
import { LibrarySection } from "./LibrarySection/LibrarySection";
import { IAtomLibraryArray } from "../../Types/types";
import { fetchLibrary } from "../../../API/API";
export const LibraryPage = () => {
  const [libraryArray, setLibraryArray] = useState<IAtomLibraryArray[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLibrary();
        setLibraryArray(data);
      } catch (error) {
        setError("Ошибка при заггрузке на уровне компонента");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <section className={s.LibraryPage}>
      <div className={s.LibraryPageMain}>{}</div>
      {libraryArray.map((item) => (
        <LibrarySection />
      ))}
    </section>
  );
};
