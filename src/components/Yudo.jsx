import { useState, useMemo } from "react";
import "../styles/Yudo.css"; 

const YUDO_OPTIONS = [
    { value: "", label: "유도량 선택", required: [], formula: "" },
    { value: "volume", label: "부피 (m³)", required: ["length"], formula: "부피 = 길이 × 길이 × 길이" },
    { value: "area", label: "넓이 (m²)", required: ["length"], formula: "넓이 = 길이 × 길이" }, 
    { value: "speed", label: "속도 (m/s)", required: ["length", "time"], formula: "속도 = 길이 / 시간" },
    { value: "density", label: "밀도 (kg/m³)", required: ["mass", "length"], formula: "밀도 = 질량 / 길이³" },
    { value: "acceleration", label: "가속도 (m/s²)", required: ["length", "time"], formula: "가속도 = 길이 / 시간²" }, 
    { value: "force", label: "힘 (N)", required: ["mass", "length", "time"], formula: "힘 = 질량 × 길이 / 시간²" }, 
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

export default function Yudo() {
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
                        calculatedResult = `${numValues.mass} × ${numValues.length} / ${numValues.time}²`;
                    } else {
                        const resultValue = numValues.mass * numValues.length / (numValues.time ** 2);
                        calculatedResult = `${resultValue.toFixed(5).replace(/\.?0+$/, '')} N`;
                        calculationString = `${numValues.mass} × ${numValues.length} / ${numValues.time}² = ${resultValue.toFixed(5).replace(/\.?0+$/, '')}`;
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
                    </div>
                )}
            </div>
        </div>
    );
}