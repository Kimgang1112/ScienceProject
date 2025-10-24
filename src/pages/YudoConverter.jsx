import React, { useState } from 'react'
import InputBox from '../components/InputBox'

export default function YudoConverter() {
  const [values, setValues] = useState({
    second: '',
    meter: '',
    kilogram: '',
    ampare: '',
    kelvin: '',
    candella: '',
    mol: '',
  })
  const [choice, setChoice] = useState('')
  const [result, setResult] = useState('')

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const yudoRequired = {
    '0': ['meter'], // 넓이
    '1': ['meter'], // 부피
    '2': ['meter', 'second'], // 속력
    '3': ['meter', 'second'], // 가속도
    '4': ['meter', 'kilogram'], // 밀도
  }

  const handleResult = () => {
    let r = 0
    let unit = ''
    const m = parseFloat(values.meter)
    const s = parseFloat(values.second)
    const kg = parseFloat(values.kilogram)

    switch (choice) {
      case '0':
        if (!m) return alert('길이 값을 지정해주세요.')
        r = m * m
        unit = 'm²'
        break
      case '1':
        if (!m) return alert('길이 값을 지정해주세요.')
        r = m * m * m
        unit = 'm³'
        break
      case '2':
        if (!m || !s) return alert('길이와 시간을 지정해주세요.')
        r = m / s
        unit = 'm/s'
        break
      case '3':
        if (!m || !s) return alert('길이와 시간을 지정해주세요.')
        r = m / (s * s)
        unit = 'm/s²'
        break
      case '4':
        if (!m || !kg) return alert('길이와 질량 값을 지정해주세요.')
        r = kg / (m * m * m)
        unit = 'kg/m³'
        break
      default:
        return alert('유도량을 선택해주세요.')
    }

    setResult(`결과 : ${r} ${unit}`)
    
  }

  return (
    <div className="yudo-container">
      <h1 id="title">유도량 변환기</h1>

      <form>
        <InputBox label="시간" name="second" placeholder="초(s)" value={values.second} onChange={handleChange} disabled={!yudoRequired[choice]?.includes('second')} />
        <InputBox label="길이" name="meter" placeholder="미터(m)" value={values.meter} onChange={handleChange} disabled={!yudoRequired[choice]?.includes('meter')} />
        <InputBox label="질량" name="kilogram" placeholder="킬로그램(kg)" value={values.kilogram} onChange={handleChange} disabled={!yudoRequired[choice]?.includes('kilogram')} />
        <InputBox label="전류" name="ampare" placeholder="암페어(A)" value={values.ampare} onChange={handleChange} disabled />
        <InputBox label="온도" name="kelvin" placeholder="켈빈(K)" value={values.kelvin} onChange={handleChange} disabled />
        <InputBox label="광도" name="candella" placeholder="칸델라(cd)" value={values.candella} onChange={handleChange} disabled />
        <InputBox label="물질량" name="mol" placeholder="몰(mol)" value={values.mol} onChange={handleChange} disabled />

        <label>유도량 선택</label>
        <select onChange={(e) => setChoice(e.target.value)} value={choice}>
          <option value="" disabled>유도량을 선택하세요</option>
          <option value="0">넓이</option>
          <option value="1">부피</option>
          <option value="2">속력</option>
          <option value="3">가속도</option>
          <option value="4">밀도</option>
        </select>
        <div>
          <button type="button" onClick={handleResult} className="result">결과가 나오는 버튼</button>
        </div>
        <div className="result_v">{result}</div>
      </form>
    </div>
  )
}
