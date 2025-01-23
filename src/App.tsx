import { useState } from "react";
import "./App.css";
import { Footer } from "./Components/UI/Footer/Footer";
import { Header } from "./Components/UI/Header/Header";

function App() {
  const [isModalShow, setIsModalShow] = useState(false);
  const openModal = () => {
    setIsModalShow(!isModalShow);
  };
  const сloseModal = () => {
    setIsModalShow(!isModalShow);
  };

  return (
    <div className="App">
      <Header />
      <button onClick={openModal}>modal</button>
      <div
        className={`modal ${isModalShow ? "active" : ""}`}
        onClick={сloseModal}
      >
        <div className="modalContent">
          <p>modal</p>
        </div>
      </div>

      {/* <InstructionPage /> */}
      <Footer />
    </div>
  );
}

export default App;
