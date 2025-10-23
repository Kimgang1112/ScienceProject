import { useState } from "react";
import "../styles/Yudo.css";

export default function Yudo() {
  const [values, setValues] = useState({
    second: "",
    meter: "",
    kilogram: "",
    ampere: "",
    kelvin: "",
    candela: "",
    mol: ""
  });
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: parseFloat(e.target.value) || ""
    });
  };

  const handleResult = () => {
    const { second, meter, kilogram, ampere, kelvin, candela, mol } = values;

    if ((["2","3","7"].includes(choice) && !second) ||
        (["0","1","2","3","4","5","6","7"].includes(choice) && !meter) ||
        (["4","7"].includes(choice) && !kilogram) ||
        (["6"].includes(choice) && !ampere) ||
        (["9"].includes(choice) && !kelvin) ||
        (["8"].includes(choice) && !candela) ||
        (["5"].includes(choice) && !mol)) {
      alert("활성화된 입력칸을 모두 입력해주세요!");
      return;
    }

    let value = 0;
    let unit = "";

    switch (choice) {
      case "0": value = meter ** 2; unit = "m²"; break;
      case "1": value = meter ** 3; unit = "m³"; break;
      case "2": value = meter / second; unit = "m/s"; break;
      case "3": value = meter / (second ** 2); unit = "m/s²"; break;
      case "4": value = kilogram / (meter ** 3); unit = "kg/m³"; break;
      case "5": value = mol / (meter ** 3); unit = "mol/m³"; break;
      case "6": value = ampere / (meter ** 2); unit = "A/m²"; break;
      case "7": value = kilogram * (meter ** 2) / (second ** 2); unit = "J (kg·m²/s²)"; break;
      case "8": value = candela; unit = "cd"; break;
      case "9": value = kelvin; unit = "K"; break;
      default: value = ""; unit = "";
    }

    setResult(value !== "" ? `${value} ${unit}` : "");
  };

  const isDisabled = {
    second: !["2","3","7"].includes(choice),
    meter: !["0","1","2","3","4","5","6","7"].includes(choice),
    kilogram: !["4","7"].includes(choice),
    ampere: !["6"].includes(choice),
    kelvin: !["9"].includes(choice),
    candela: !["8"].includes(choice),
    mol: !["5"].includes(choice)
  };

  return (
    <div className="yudo-wrapper">
      <div className="yudo-card">
        <h1 className="yudo-title">유도량 변환기</h1>

        <div className="input-group">
          <label>시간 (s)</label>
          <input type="number" name="second" value={values.second} onChange={handleChange} disabled={isDisabled.second}/>
        </div>

        <div className="input-group">
          <label>길이 (m)</label>
          <input type="number" name="meter" value={values.meter} onChange={handleChange} disabled={isDisabled.meter}/>
        </div>

        <div className="input-group">
          <label>질량 (kg)</label>
          <input type="number" name="kilogram" value={values.kilogram} onChange={handleChange} disabled={isDisabled.kilogram}/>
        </div>

        <div className="input-group">
          <label>전류 (A)</label>
          <input type="number" name="ampere" value={values.ampere} onChange={handleChange} disabled={isDisabled.ampere}/>
        </div>

        <div className="input-group">
          <label>온도 (K)</label>
          <input type="number" name="kelvin" value={values.kelvin} onChange={handleChange} disabled={isDisabled.kelvin}/>
        </div>

        <div className="input-group">
          <label>광도 (cd)</label>
          <input type="number" name="candela" value={values.candela} onChange={handleChange} disabled={isDisabled.candela}/>
        </div>

        <div className="input-group">
          <label>물질량 (mol)</label>
          <input type="number" name="mol" value={values.mol} onChange={handleChange} disabled={isDisabled.mol}/>
        </div>

        <select className="yudo-select" onChange={(e) => setChoice(e.target.value)}>
          <option value="">유도량 선택</option>
          <option value="0">넓이</option>
          <option value="1">부피</option>
          <option value="2">속력</option>
          <option value="3">가속도</option>
          <option value="4">밀도</option>
          <option value="5">농도</option>
          <option value="6">전류 밀도</option>
          <option value="7">에너지</option>
          <option value="8">광도</option>
          <option value="9">온도</option>
        </select>

        <button className="yudo-btn" onClick={handleResult}>결과 보기</button>

        {result && (
          <div className="result-box">
            📌 <span className="result-text">{result}</span>
          </div>
        )}
      </div>
    </div>
  );
}
