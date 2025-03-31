import {
  IFAQItem,
  ILibraryArray,
  IVideoSection,
} from "../Components/Types/types";

export const fetchVideos = async (): Promise<IVideoSection[]> => {
  const response = await fetch(
    "http://atom-bim-site-server.vercel.app/api/videos"
  );
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  return response.json();
};

export const fetchFaq = async (): Promise<IFAQItem[]> => {
  const response = await fetch(
    "http://atom-bim-site-server.vercel.app//api/faq"
  );
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};
export const fetchLibrary = async (): Promise<ILibraryArray[]> => {
  const response = await fetch(
    "http://atom-bim-site-server.vercel.app/api/library"
  );
  if (!response.ok) throw new Error("Ошибка на сервере");
  return response.json();
};
