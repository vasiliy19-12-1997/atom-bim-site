import { useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.scss";
import { AppRouter } from "./Components/Router/AppRouter";
import { AtomInput } from "./Components/UI/AtomInput/AtomInput";
import { Footer } from "./Components/UI/Footer/Footer";
import { Header } from "./Components/UI/Header/Header";
import Modal from "./Components/UI/Modal/Modal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const location = useLocation();
  const isAuthPage = location.pathname.includes("/login");
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      {!isAuthPage && (
        <Header
          openModal={openModal}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AtomInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Поиск"
          type="text"
          module="modal"
        />
        <p>Начните ввод, чтобы увидеть результат</p>
      </Modal>
      {/* <button
        style={{ marginTop: "200px", position: "fixed", zIndex: "1000" }}
        onClick={() => setIsAuthenticated(!isAuthenticated)}
      >
        Переключить
      </button> */}
      <main>
        <div className="container">
          <AppRouter isAuthenticated={isAuthenticated} />
        </div>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
