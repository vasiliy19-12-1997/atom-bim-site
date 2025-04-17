import {
  IFAQItem,
  ILibraryArray,
  IVideoSection,
} from "../Components/Types/types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http:atom-bim-site-server-n8qiz2q9v-vasiliy19121997s-projects.vercel.app";

export const fetchVideos = async (): Promise<IVideoSection[]> => {
  const response = await fetch(`${API_BASE_URL}/api/videos`);
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  return response.json();
};

export const fetchFaq = async (): Promise<IFAQItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/faq`);
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};

export const fetchLibrary = async (): Promise<ILibraryArray[]> => {
  const response = await fetch(`${API_BASE_URL}/api/library`);
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};
