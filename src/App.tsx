import { useState } from "react";
import "./App.scss";
import { InstructionPage } from "./Components/Pages/InstructionPage";
import { AtomInput } from "./Components/UI/AtomInput/AtomInput";
import { Footer } from "./Components/UI/Footer/Footer";
import { Header } from "./Components/UI/Header/Header";
import Modal from "./Components/UI/Modal/Modal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <Header openModal={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AtomInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Поиск"
          type="text"
          module="m"
        />
        <p>Начните ввод, чтобы увидеть результат</p>
      </Modal>
      <main>
        <div className="container">
          <InstructionPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
