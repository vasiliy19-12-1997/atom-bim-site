export interface IAsideProps {
  position: "left" | "right";
  show: boolean;
  toggleShow: () => void;
  children: React.ReactNode;
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
export interface FAQItem {
  question: string;
  answer: string;
}
export interface IVideoListProps {
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
