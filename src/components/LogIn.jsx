import { useState } from "react";

export default function Login() {
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
      setMsg("로그인 성공!");
      localStorage.setItem("loginUser", username); // 로그인 저장
      window.location.href = "/main"; // 페이지 이동
    } else {
      setMsg("로그인 실패!");
    }
  };

  return (
    <div>
      <h2>로그인</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
