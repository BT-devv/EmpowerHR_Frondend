import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
<<<<<<< HEAD
      <p>BuiTrungTuan-2174801030024</p>
      <p>Lê Thái Vỹ</p>
=======
      <p>Bùi Trung Tuấn</p>
      <h2>Lê Thái Vỹ</h2>
>>>>>>> f70d98b3a76f5373a9c8f0d363c609498b87ddbd
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click some.</p>
    </>
  );
}

export default App;
