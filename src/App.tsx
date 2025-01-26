import { useState } from "react";
import "./App.css";
import { AtomInput } from "./Components/UI/AtomInput/AtomInput";
import { Footer } from "./Components/UI/Footer/Footer";
import { Header } from "./Components/UI/Header/Header";
import Modal from "./Components/UI/Modal/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          value=""
          onChange={() => console.log("Input changed")}
          placeholder="Поиск"
          type="text"
          onClick={() => console.log("ModalInput")}
          module="m"
        />
        <p>Начните ввод, чтобы увидеть результат</p>
      </Modal>
      {/* <InstructionPage /> */}
      <Footer />
    </div>
  );
}

export default App;
