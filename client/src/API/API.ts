export interface IVideoSection {
  category: string;
  urls: string[];
  text: string[];
}

export const fetchVideos = async (): Promise<IVideoSection[]> => {
  const response = await fetch("http://localhost:5000/api/videos");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  return response.json();
};
