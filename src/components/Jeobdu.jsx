import { useState } from "react";
import "../styles/Jeobdu.css";

export default function Jeobdu() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setOutputValue(value * 1000); // 예시 변환 로직
  };

  return (
    <div className="jeobdu">
      <h1 id="title">접두어 변환기</h1>
      <div>
        <label>
          바꾸는 값
          <input type="number" value={inputValue} onChange={handleChange} />
        </label>
        ➡️
        <label>
          바뀌는 값
          <input type="text" value={outputValue} readOnly />
        </label>
      </div>
    </div>
  );
}
