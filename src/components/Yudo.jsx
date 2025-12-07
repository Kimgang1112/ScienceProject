import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Yudo.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const YUDO_OPTIONS = [
    { value: "", label: "유도량 선택", required: [], formula: "" },
    { value: "volume", label: "부피 (m³)", required: ["length"], formula: "부피 = 길이 × 길이 × 길이" },
    { value: "area", label: "넓이 (m²)", required: ["length"], formula: "넓이 = 길이 × 길이" }, 
    { value: "speed", label: "속도 (m/s)", required: ["length", "time"], formula: "속도 = 길이 / 시간" },
    { value: "density", label: "밀도 (kg/m³)", required: ["mass", "length"], formula: "밀도 = 질량 / 길이³" },
    { value: "acceleration", label: "가속도 (m/s²)", required: ["length", "time"], formula: "가속도 = 길이 / 시간²" }, 
    { value: "force", label: "힘 (N)", required: ["mass", "length", "time"], formula: "힘 = 질량 × 길이 / 시간²" }, 
    { value: "work", label: "일 (J)", required: ["mass", "length", "time"], formula: "일 = 질량 × 길이² / 시간²" },
    { value: "power", label: "일률 (W)", required: ["mass", "length", "time"], formula: "일률 = 질량 × 길이² / 시간³" },
];

const BASE_UNITS = [
    { name: "time", label: "시간 (s)" },
    { name: "length", label: "길이 (m)" },
    { name: "mass", label: "질량 (kg)" },
    { name: "current", label: "전류 (A)" },
    { name: "temperature", label: "온도 (K)" },
    { name: "luminosity", label: "광도 (cd)" },
    { name: "mole", label: "물질량 (mol)" },
];

const getYudoDescription = (yudoType) => {
    const descriptions = {
        volume: "부피는 3차원 공간에서 물체가 차지하는 공간의 크기를 나타내는 유도량입니다. 길이의 세제곱으로 계산되며, SI 단위는 세제곱미터(m³)입니다.",
        area: "넓이는 2차원 평면에서 도형이 차지하는 면의 크기를 나타내는 유도량입니다. 길이의 제곱으로 계산되며, SI 단위는 제곱미터(m²)입니다.",
        speed: "속도는 물체의 위치 변화율을 나타내는 유도량입니다. 단위 시간당 이동한 거리로 계산되며, SI 단위는 미터 매 초(m/s)입니다.",
        density: "밀도는 단위 부피당 질량을 나타내는 유도량입니다. 물질의 특성을 나타내는 중요한 물리량으로, SI 단위는 킬로그램 매 세제곱미터(kg/m³)입니다.",
        acceleration: "가속도는 속도의 변화율을 나타내는 유도량입니다. 단위 시간당 속도 변화량으로 계산되며, SI 단위는 미터 매 초제곱(m/s²)입니다.",
        force: "힘은 물체의 운동 상태를 변화시키는 원인이 되는 유도량입니다. 질량과 가속도의 곱으로 정의되며(F=ma), SI 단위는 뉴턴(N)입니다.",
        work: "일은 힘이 물체를 이동시킬 때 한 일의 양을 나타내는 유도량입니다. 힘과 이동거리의 곱으로 계산되며, SI 단위는 줄(J)입니다.",
        power: "일률은 단위 시간당 한 일의 양을 나타내는 유도량입니다. 에너지 전환 속도를 의미하며, SI 단위는 와트(W)입니다."
    };
    return descriptions[yudoType] || "";
};

export default function Yudo({isLoggedIn}) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        time: "", length: "", mass: "", current: "",
        temperature: "", luminosity: "", mole: "",
    });
    const [selectedYudo, setSelectedYudo] = useState(YUDO_OPTIONS[0].value);

    const currentYudoOption = YUDO_OPTIONS.find(o => o.value === selectedYudo) || YUDO_OPTIONS[0];

    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const calculation = useMemo(() => {
        if (currentYudoOption.value === "") {
            return { result: "", formula: "", calculationString: "" };
        }

        const numValues = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
        );

        let calculatedResult = "";
        let calculationString = "";
        
        const requiredInputs = currentYudoOption.required.filter(key => parseFloat(values[key]) > 0).length;
        const totalRequired = currentYudoOption.required.length;

        if (requiredInputs < totalRequired) {
            calculatedResult = "값을 입력해 주세요.";
            calculationString = ""; 
        } else {
            switch (currentYudoOption.value) {
                case "volume": {
                    const resultValue = numValues.length ** 3;
                    calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} m³`;
                    calculationString = `${numValues.length} × ${numValues.length} × ${numValues.length} = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    break;
                }
                case "area": {
                    const resultValue = numValues.length ** 2;
                    calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} m²`;
                    calculationString = `${numValues.length} × ${numValues.length} = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    break;
                }
                case "speed": {
                    if (numValues.time === 0) {
                        calculatedResult = "시간은 0이 될 수 없습니다.";
                        calculationString = `${numValues.length} / ${numValues.time}`;
                    } else {
                        const resultValue = numValues.length / numValues.time;
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} m/s`;
                        calculationString = `${numValues.length} / ${numValues.time} = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                case "density": {
                    if (numValues.length === 0) {
                         calculatedResult = "길이는 0이 될 수 없습니다.";
                         calculationString = `${numValues.mass} / ${numValues.length}³`;
                    } else {
                        const resultValue = numValues.mass / (numValues.length ** 3);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} kg/m³`;
                        calculationString = `${numValues.mass} / ${numValues.length}³ = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                case "acceleration": {
                    if (numValues.time === 0) {
                        calculatedResult = "시간은 0이 될 수 없습니다.";
                        calculationString = `${numValues.length} / ${numValues.time}²`;
                    } else {
                        const resultValue = numValues.length / (numValues.time ** 2);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} m/s²`;
                        calculationString = `${numValues.length} / ${numValues.time}² = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                case "force": {
                    if (numValues.time === 0) {
                        calculatedResult = "시간은 0이 될 수 없습니다.";
                        calculationString = `${numValues.mass} × ${numValues.length} / ${numValues.time}²`;
                    } else {
                        const resultValue = numValues.mass * numValues.length / (numValues.time ** 2);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} N`;
                        calculationString = `${numValues.mass} × ${numValues.length} / ${numValues.time}² = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                case "work": {
                    if (numValues.time === 0) {
                        calculatedResult = "시간은 0이 될 수 없습니다.";
                        calculationString = `${numValues.mass} × ${numValues.length}² / ${numValues.time}²`;
                    } else {
                        const resultValue = numValues.mass * (numValues.length ** 2) / (numValues.time ** 2);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} J`;
                        calculationString = `${numValues.mass} × ${numValues.length}² / ${numValues.time}² = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                case "power": {
                    if (numValues.time === 0) {
                        calculatedResult = "시간은 0이 될 수 없습니다.";
                        calculationString = `${numValues.mass} × ${numValues.length}² / ${numValues.time}³`;
                    } else {
                        const resultValue = numValues.mass * (numValues.length ** 2) / (numValues.time ** 3);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} W`;
                        calculationString = `${numValues.mass} × ${numValues.length}² / ${numValues.time}³ = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
                    }
                    break;
                }
                default:
                    calculatedResult = "유도량을 선택하세요.";
            }
        }
       
        
        return { 
            result: calculatedResult, 
            formula: currentYudoOption.formula,
            calculationString: calculationString 
        };
    }, [values, selectedYudo, currentYudoOption.value, currentYudoOption.formula]);

    const handleYudoChange = (e) => {
        const newYudo = e.target.value;
        setSelectedYudo(newYudo);
        
        const newOption = YUDO_OPTIONS.find(o => o.value === newYudo) || YUDO_OPTIONS[0];
        const requiredNames = newOption.required;
        
        setValues(prev => {
            const newValues = {};
            BASE_UNITS.forEach(unit => {
                newValues[unit.name] = requiredNames.includes(unit.name) ? prev[unit.name] : "";
            });
            return newValues;
        });
    };

    return (
        <div className="yudo-wrapper">
            <button className="home-nav-button" onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faHome} /> 홈
            </button>
            <div className="yudo-card">
                <h1 className="yudo-title">유도량 변환기</h1>

                <div className="yudo-input-grid">
                    {BASE_UNITS.map(unit => {
                        const isDisabled = !currentYudoOption.required.includes(unit.name);
                        
                        return (
                            <div key={unit.name} className="yudo-input-group">
                                <label htmlFor={`input-${unit.name}`}>{unit.label}</label>
                                <input
                                    id={`input-${unit.name}`}
                                    type="number"
                                    value={values[unit.name]}
                                    onChange={(e) => handleChange(unit.name, e.target.value)}
                                    placeholder={isDisabled ? "유도량 선택 필요" : "값"}
                                    disabled={isDisabled}
                                />
                            </div>
                        );
                    })}
                </div>
                
                <div className="yudo-select-group">
                    <select
                        className="yudo-select"
                        value={selectedYudo}
                        onChange={handleYudoChange}
                    >
                        {YUDO_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedYudo !== "" && (
                    <div className="yudo-result-box">
                        <p className="yudo-formula">{calculation.formula}</p>
                        
                        {calculation.calculationString && (
                             <p className="yudo-calculation-string">{calculation.calculationString}</p>
                        )}
                        
                        <p className="yudo-calculated-result"> 
                            {calculation.result}
                        </p>

                        {isLoggedIn && (
                            <div className="yudo-description">
                                <h3>유도량 설명</h3>
                                <p>{getYudoDescription(selectedYudo)}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}