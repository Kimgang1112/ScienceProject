import { Link, Routes, Route } from "react-router-dom";
import Yudo from "./yudo.jsx";
import Jeopdu from "./jeopdu.jsx";
import "./App.css";

export default function App() {
  return (
    <div>
      <h1 id="title">무슨 기능을 사용하시겠습니까?</h1>
      <div id="f_div">
        <Link to="/yudo">
          <button id="f_button">유도량 변환</button>
        </Link>
        <Link to="/jeopdu">
          <button id="j_button">접두어 변환</button>
        </Link>
      </div>

      <Routes>
        <Route path="/yudo" element={<Yudo />} />
        <Route path="/jeopdu" element={<Jeopdu />} />
      </Routes>
    </div>
  );
}
