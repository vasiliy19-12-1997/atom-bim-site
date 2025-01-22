import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./Components/UI/Header/Header";
import { InstructionPage } from "./Components/Pages/InstructionPage";
import { Footer } from "./Components/UI/Footer/Footer";
import { useState } from "react";
import { AtomInput } from "./Components/UI/AtomInput/AtomInput";
import Modal from "./Components/UI/Modal/Modal";
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(isModalOpen);

  return (
    <div className="App">
      <Header openModal={openModal} />
      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Modal Title</h2>
        <p>This is the content of the modal.</p>
      </Modal>
      {/* <InstructionPage /> */}

      <Footer />
    </div>
  );
}

export default App;
