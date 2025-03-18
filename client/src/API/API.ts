import {
  IAtomLibraryArray,
  IFAQItem,
  IVideoSection,
} from "../Components/Types/types";

export const fetchVideos = async (): Promise<IVideoSection[]> => {
  const response = await fetch("http://localhost:5000/api/videos");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  return response.json();
};

export const fetchFaq = async (): Promise<IFAQItem[]> => {
  const response = await fetch("http://localhost:5000/api/faq");
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};
export const fetchLibrary = async (): Promise<IAtomLibraryArray[]> => {
  const response = await fetch("http://localhost:5000/api/library");
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};
