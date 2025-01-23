//UI
export interface IAtomInput {
  value: string;
  onChange: () => void;
  placeholder: string;
  type: string;
  className?: string;
}
export interface AsideProps {
  position: "left" | "right";
  show: boolean;
  toggleShow: () => void;
}
