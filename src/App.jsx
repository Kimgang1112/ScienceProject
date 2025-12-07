import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Yudo from "./components/Yudo";
import Jeobdu from "./components/Jeobdu";
import Signup from "./components/SignUp";
import Login from "./components/LogIn";
import { useState, useEffect } from "react";

export default function App() {
  // localStorage에서 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState === 'true';
  });

  // isLoggedIn 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/yudo" element={<Yudo isLoggedIn={isLoggedIn}/>} />
        <Route path="/jeobdu" element={<Jeobdu isLoggedIn={isLoggedIn}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}