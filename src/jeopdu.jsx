import { useState } from "react";
import "./jeopdu.css";

export default function Jeopdu() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <h1 id="title">접두어 변환기</h1>
      <div>
        <label>
          바꾸는 값
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        ➡️
        <label>
          바뀌는 값
          <input type="text" value={output} readOnly />
        </label>
      </div>
    </div>
  );
}
