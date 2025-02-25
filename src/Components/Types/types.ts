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
  placeholder: string;
  type: string;
  onClick?: () => void;
  module: inputModule;
}
export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
