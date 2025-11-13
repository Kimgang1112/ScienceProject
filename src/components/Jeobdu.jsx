import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Jeobdu.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faHome } from "@fortawesome/free-solid-svg-icons";

const PREFIX_MAP = {
  exa: 1e18, 
  peta: 1e15,
  tera: 1e12,
  giga: 1e9,
  mega: 1e6,
  kilo: 1e3,
  none: 1,
  milli: 1e-3,
  micro: 1e-6,
  nano: 1e-9,
  pico: 1e-12,
};

const PREFIX_OPTIONS = [
  { value: "exa", label: "Exa (E)" }, 
  { value: "peta", label: "Peta (P)" },
  { value: "tera", label: "Tera (T)" },
  { value: "giga", label: "Giga (G)" },
  { value: "mega", label: "Mega (M)" },
  { value: "kilo", label: "Kilo (k)" },
  { value: "none", label: "기본 단위 (-)" },
  { value: "milli", label: "Milli (m)" },
  { value: "micro", label: "Micro (µ)" },
  { value: "nano", label: "Nano (n)" },
  { value: "pico", label: "Pico (p)" }, 
];

export default function Jeobdu() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [fromPrefix, setFromPrefix] = useState("kilo");
  const [toPrefix, setToPrefix] = useState("milli");

  const outputValue = useMemo(() => {
    const numValue = parseFloat(inputValue);

    if (isNaN(numValue) || inputValue === "") {
      return "";
    }

    const fromFactor = PREFIX_MAP[fromPrefix];
    const toFactor = PREFIX_MAP[toPrefix];

    if (!fromFactor || !toFactor) {
        return "변환 오류"; 
    }
    
    const baseValue = numValue * fromFactor;
    const result = baseValue / toFactor;

    return result.toFixed(12).replace(/\.?0+$/, ''); 
  }, [inputValue, fromPrefix, toPrefix]);


  return (
    <div className="jeobdu-wrapper">
        <button className="home-nav-button" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHome} /> 홈
        </button>
      <div className="jeobdu-card">
        <h1 className="jeobdu-title">접두어 변환기</h1>
        
        <div className="jeobdu-select-row">
            <div className="jeobdu-select-group start-group">
                <label htmlFor="from-prefix-select" className="jeobdu-select-label from-label">시작 접두어</label>
                <select 
                    id="from-prefix-select"
                    className="jeobdu-select"
                    value={fromPrefix}
                    onChange={(e) => setFromPrefix(e.target.value)}
                >
                    {PREFIX_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="jeobdu-select-group end-group">
                <label htmlFor="to-prefix-select" className="jeobdu-select-label to-label">목표 접두어</label>
                <select 
                    id="to-prefix-select"
                    className="jeobdu-select"
                    value={toPrefix}
                    onChange={(e) => setToPrefix(e.target.value)}
                >
                    {PREFIX_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="jeobdu-input-row">
            
            <div className="jeobdu-input-group">
                <label htmlFor="input-from">변환할 값</label>
                <input
                  id="input-from"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="값"
                />
            </div>

            <div className="jeobdu-arrow-container">
                 <FontAwesomeIcon icon={faArrowRightLong} className="jeobdu-arrow-icon" />
            </div>

            <div className="jeobdu-input-group">
                <label htmlFor="input-to">변환된 값</label>
                <input
                  id="input-to"
                  type="text"
                  value={outputValue}
                  readOnly
                  placeholder="결과"
                />
            </div>
        </div>

        {inputValue && (
          <div className="jeobdu-result-box">
            <span className="jeobdu-result-text">{inputValue} {fromPrefix}</span> = <span className="jeobdu-result-text">{outputValue} {toPrefix}</span>
          </div>
        )}
      </div>
    </div>
  );
}