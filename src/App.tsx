import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./Components/Header/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="Container">
        <aside className="leftBar" aria-label="Left Sidebar">
          <h2>Left Sidebar</h2>
        </aside>
        <main className="Main" aria-label="Main Content">
          <h2>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
            itaque quam excepturi, inventore tempore sint impedit minus, qui
            deserunt exercitationem, maxime corporis et sunt ducimus tempora
            sequi distinctio aut pariatur! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Nulla fugit libero ea corrupti minus
            accusamus! Reprehenderit accusamus repudiandae nobis veritatis
            exercitationem voluptates nesciunt cum dolore, distinctio
            praesentium! Ratione, autem eos. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Deserunt quisquam obcaecati inventore
            unde distinctio iure doloribus dolores rerum nihil, suscipit placeat
            ad maxime eveniet sequi excepturi, hic nesciunt architecto harum.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non velit
            nam sed modi omnis voluptates iste voluptatibus recusandae nobis
            sunt laboriosam blanditiis incidunt quasi quibusdam consequuntur
            pariatur, illo minima a?
          </h2>
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
