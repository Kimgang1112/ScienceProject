import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Yudo from "./components/Yudo";
import Jeobdu from "./components/Jeobdu";
import Singup from "./components/SignUp";
import Login from "./components/LogIn";
import { useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/yudo" element={<Yudo />} />
        <Route path="/jeobdu" element={<Jeobdu isLoggedIn={isLoggedIn}/>} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}