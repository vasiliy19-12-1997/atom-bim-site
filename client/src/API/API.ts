import {
  IFAQItem,
  ILibraryArray,
  IVideoSection,
} from "../Components/Types/types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001";

export const fetchVideos = async (): Promise<IVideoSection[]> => {
  const response = await fetch(`${API_BASE_URL}/api/video`);
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
