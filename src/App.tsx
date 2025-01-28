import React, { useRef, useState } from "react";
import { Header } from "./Components/UI/Header/Header";
import { InstructionPage } from "./Components/Pages/InstructionPage";
import { Footer } from "./Components/UI/Footer/Footer";
import { AtomInput } from "./Components/UI/AtomInput/AtomInput";
import Modal from "./Components/UI/Modal/Modal";
import "./App.css";
import { Aside } from "./Components/UI/Aside/Aside";

function App() {
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
      <main className="container">
        <Aside />
        <InstructionPage />
        <Aside />
      </main>
      <Footer />
    </div>
  );
}

export default App;
