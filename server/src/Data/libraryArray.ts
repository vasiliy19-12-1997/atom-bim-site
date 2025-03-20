interface ILibraryItem {
  title: string;
  image: string;
}
interface IAtomLibraryArray {
  category: string;
  items: ILibraryItem[];
}

export const atomLibraryArray: IAtomLibraryArray[] = [
  {
    category: "Revit 2020",
    items: [
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Муниципальные_объекты)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_КЖ",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_ВК",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_ЭЛ",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
    ],
  },
  {
    category: "Civil3D 2023",
    items: [
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
    ],
  },
  {
    category: "Autocad 2020-2023",
    items: [
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
      {
        title: "АСК_Шаблон_АР (Жилье)",
        image: "https://atom-bim.ru/Librarry/img/template2.png",
      },
    ],
  },
];
