import { useState } from "react";
import "./yudo.css";

export default function Yudo() {
  const [inputs, setInputs] = useState({
    second: "",
    meter: "",
    kilogram: "",
    ampare: "",
    kelvin: "",
    candella: "",
    mol: "",
  });
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calcResult = () => {
    let res = "";
    let unit = "";
    if (choice === "0") {
      if (!inputs.meter) return alert("길이값을 지정해주세요.");
      res = Math.pow(parseFloat(inputs.meter), 2);
      unit = "m²";
    }
    if (choice === "1") {
      if (!inputs.meter) return alert("길이값을 지정해주세요.");
      res = Math.pow(parseFloat(inputs.meter), 3);
      unit = "m³";
    }
    if (choice === "2") {
      if (!inputs.meter) return alert("길이값을 지정해주세요.");
      if (!inputs.second) return alert("시간값을 지정해주세요.");
      res = parseFloat(inputs.meter) / parseFloat(inputs.second);
      unit = "m/s";
    }
    if (choice === "3") {
      if (!inputs.meter) return alert("길이값을 지정해주세요.");
      if (!inputs.second) return alert("시간값을 지정해주세요.");
      res = parseFloat(inputs.meter) / Math.pow(parseFloat(inputs.second), 2);
      unit = "m/s²";
    }
    if (choice === "4") {
      if (!inputs.meter) return alert("길이값을 지정해주세요.");
      if (!inputs.kilogram) return alert("질량값을 지정해주세요.");
      res = parseFloat(inputs.kilogram) / Math.pow(parseFloat(inputs.meter), 3);
      unit = "kg/m³";
    }
    setResult(`결과 : ${res}${unit}`);
  };

  return (
    <div>
      <h1 id="title">유도량 변환기</h1>
      <div className="stdi">
        <label>
          시간
          <input
            type="text"
            placeholder="초(s)"
            name="second"
            className="inputbox"
            value={inputs.second}
            onChange={handleChange}
            disabled={!(choice === "2" || choice === "3")}
          />
        </label>
      </div>
      <div className="stdi">
        <label>
          길이
          <input
            type="text"
            placeholder="미터(m)"
            name="meter"
            className="inputbox"
            value={inputs.meter}
            onChange={handleChange}
            disabled={!["0", "1", "2", "3", "4"].includes(choice)}
          />
        </label>
      </div>
      <div className="stdi">
        <label>
          질량
          <input
            type="text"
            placeholder="킬로그램(kg)"
            name="kilogram"
            className="inputbox"
            value={inputs.kilogram}
            onChange={handleChange}
            disabled={choice !== "4"}
          />
        </label>
      </div>

      <label>유도량 선택</label>
      <select value={choice} onChange={(e) => setChoice(e.target.value)}>
        <option value="" disabled>
          유도량을 선택하세요
        </option>
        <option value="0">넓이</option>
        <option value="1">부피</option>
        <option value="2">속력</option>
        <option value="3">가속도</option>
        <option value="4">밀도</option>
      </select>

      <div>
        <button type="button" onClick={calcResult} className="result">
          결과가 나오는 버튼
        </button>
      </div>
      <div id="result" className="result_v">
        {result}
      </div>
    </div>
  );
}
