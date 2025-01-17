import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="NavBar">
        <h1>NavBar</h1>
      </header>
      <div className="Container">
        <aside className="leftBar" aria-label="Left Sidebar">
          <h2>Left Sidebar</h2>
        </aside>
        <main className="Main" aria-label="Main Content">
          <h2>Main Content</h2>
        </main>
        <aside className="rightBar" aria-label="Right Sidebar">
          <h2>Right Sidebar</h2>
        </aside>
      </div>
      <footer className="Footer">
        <h2>Footer</h2>
      </footer>
    </div>
  );
}

export default App;
