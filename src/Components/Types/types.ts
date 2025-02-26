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
