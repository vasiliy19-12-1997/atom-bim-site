import s from "./LibrarySectiion.module.scss";
export const LibrarySection = () => {
  return (
    <>
      <article className={s.LibrarySection}>
        <h1>Шаблоны для Revit 2020</h1>
        <hr />
        <div className={s.LibrarySectionCards}>
          <div className={s.Card}>
            <img
              src="https://images.unsplash.com/photo-1734630378523-c6735d798820?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
              alt="test"
              width={150}
              height={200}
            />
            <p>АСК_Шаблон_АР (Жилье)</p>
          </div>
        </div>
      </article>
    </>
  );
};
