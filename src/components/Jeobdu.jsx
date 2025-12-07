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

export default function Jeobdu({isLoggedIn}) {
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
    
    // 기본 단위로 변환 후, 목표 단위로 다시 변환
    const baseValue = numValue * fromFactor;
    const result = baseValue / toFactor;

    // 불필요한 후행 0을 제거하고 최대 12자리까지 표시
    return result.toFixed(12).replace(/\.?0+$/, ''); 
  }, [inputValue, fromPrefix, toPrefix]);


  return (
    <div className="jeobdu-wrapper">
        <button className="home-nav-button" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHome} /> 홈
        </button>
      <div className="jeobdu-card">
        <h1 className="jeobdu-title">접두어 변환기</h1>
        
        {/* isLoggedIn이 true일 때만 설명 섹션 렌더링 */}
        {isLoggedIn && (
            <div className="jeobdu-info-section">
                <h2 className="jeobdu-info-title">🧐 SI 접두어란?</h2>
                <p>
                    SI 접두어는 국제단위계(SI)에서 기본 단위의 배수 또는 분수를 나타내기 위해 사용되는 기호입니다. 매우 크거나 작은 수를 간결하게 표현할 수 있게 도와줍니다.
                </p>
                <p>예: 10^3m(미터)는 1km (킬로미터)로 표현됩니다.</p>
                <h3 className="jeobdu-info-subtitle">주요 특징</h3>
                <ul>
                    <li>대부분 10^3 또는 10^(-3) 단위로 증감합니다.</li>
                    <li>접두어는 기본 단위(예: 미터, 그램, 초) 앞에 붙여 사용합니다.</li>
                    <li>대문자 접두어(P, T, G, M)는 주로 큰 배수(10^6 이상)에 사용됩니다.</li>
                </ul>
                <div className="jeobdu-prefix-table-guide">
                
                </div>
            </div>
        )}
        
        {/* --- 변환기 UI 부분은 그대로 유지 --- */}
        <div className="jeobdu-select-row">
            {/* ... (시작 접두어 선택) ... */}
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
            {/* ... (화살표 아이콘) ... */}
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