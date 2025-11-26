import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div className="home">
      
    <div id="nav">
      {!isLoggedIn ? (
      <>
      <div id="signup" onClick={() => navigate("/signup")}>회원가입</div>
      <div id="login" onClick={() => navigate("/login")}>로그인</div>
      </>
      ) : (
      <div id="logout" onClick={() => {
        setIsLoggedIn(false);
        alert("로그아웃 되었습니다.");
      }}>로그아웃</div>
      )}
    </div>

      
      
      
      <div className="logo-wrapper">
        <img src="/logo.png" alt="사이트 로고" className="logo" />
        
      </div>

      
      <div className="button-container">
        <button className="home-button" onClick={() => navigate("/yudo")}>
          ⚡ 유도량 변환
        </button>
        <button className="home-button" onClick={() => navigate("/jeobdu")}>
          🧮 접두어 변환
        </button>
      </div>

      <footer className="footer">
        <p>© 2025 UniSee | Made with 강조 for Science</p>
      </footer>
    </div>
  );
}