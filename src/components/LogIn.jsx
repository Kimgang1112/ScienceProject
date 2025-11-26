import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faHome } from "@fortawesome/free-solid-svg-icons";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      setIsLoggedIn(true);
      setMsg("✔ 로그인 성공!");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setIsLoggedIn(false);
      setMsg("❌ 아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-page">
      <button className="home-nav-button" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHome} /> 홈
      </button>
      <div className="login-box">
        <h2>로그인</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">시작하기</button>
        </form>

        <p className="msg">{msg}</p>

        <div className="goto-signup" onClick={() => navigate("/signup")}>
          계정이 없으신가요? 회원가입 →
        </div>
      </div>
    </div>
  );
}
