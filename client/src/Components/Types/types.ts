export interface IAsideProps {
  show?: boolean;
  children: React.ReactNode;
  className: string;
}
type inputModule = "small" | "modal" | "submit";

export interface IAtomInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute;
  onClick?: () => void;
  module: inputModule;
  required?: boolean;
  id?: string;
  name?: string;
}
export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export interface IHeaderProps {
  openModal: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}
export interface IFAQItem {
  question: string;
  answer: string;
}
export interface IVideoListProps {
  sections: IVideoSection[];
  category: string;
}
export interface Route {
  path: string;
  element: React.ElementType;
}
export type ButtonType = "button" | "submit" | "reset";
export interface IAtomButton {
  children: React.ReactNode;
  onClick: () => void;
  type: ButtonType;
}
export interface IVideoSection {
  category: string;
  urls: string[];
  text: string[];
}
export interface ILibraryItem {
  title: string;
  image: string;
}
export interface ILibraryArray {
  category: string;
  items: ILibraryItem[];
}
export interface ILibrarySection {
  category: string;
  items: ILibraryItem[];
}
