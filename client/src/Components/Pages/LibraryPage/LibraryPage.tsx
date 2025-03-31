import { useEffect, useState } from "react";
import { fetchLibrary } from "../../../API/API";
import { ILibraryArray } from "../../Types/types";
import s from "./LibraryPage.module.scss";
import { LibrarySection } from "./LibrarySection/LibrarySection";
export const LibraryPage = () => {
  const [libraryArray, setLibraryArray] = useState<ILibraryArray[]>([]);
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
        <LibrarySection category={item.category} items={item.items} />
      ))}
    </section>
  );
};
