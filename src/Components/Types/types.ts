export interface IAsideProps {
  position: "left" | "right";
  show: boolean;
  toggleShow: () => void;
  children: React.ReactNode;
}
export interface IAtomInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
  onClick?: () => void;
  module?: "s" | "m";
}
export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
