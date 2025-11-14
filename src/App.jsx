import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Yudo from "./components/Yudo";
import Jeobdu from "./components/Jeobdu";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/yudo" element={<Yudo />} />
        <Route path="/jeobdu" element={<Jeobdu />} />
      </Routes>
    </Router>
  );
}