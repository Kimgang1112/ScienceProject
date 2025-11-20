import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [msg, setMsg] = useState("");

  const validate = () => {
    if (username.length < 4) return "아이디는 4자 이상이어야 합니다.";
    if (password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    if (password !== passwordCheck) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setMsg(error);
      return;
    }
    setMsg("");
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      setMsg("🎉 회원가입 성공!");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      setMsg("회원가입 실패 (아이디 중복)");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>회원가입</h2>

        <form onSubmit={handleSignup}>
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

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />

          <button type="submit">계정 만들기</button>
        </form>

        <p className="msg">{msg}</p>

        <div className="goto-login" onClick={() => navigate("/login")}>
          이미 계정이 있으신가요? 로그인 →
        </div>
      </div>
    </div>
  );
}
