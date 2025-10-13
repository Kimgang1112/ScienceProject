import React, { useState } from 'react'

export default function PrefixConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  // 여기서 원하는 변환 로직 추가 가능
  const handleChange = (e) => {
    setInput(e.target.value)
    setOutput(e.target.value) // 임시로 그대로 출력
  }

  return (
    <div className="prefix-container">
      <h1 id="title">접두어 변환기</h1>
      <div>
        <label>
          바꾸는 값
          <input type="text" value={input} onChange={handleChange} />
        </label>
        ➡️
        <label>
          바뀌는 값
          <input type="text" value={output} readOnly />
        </label>
      </div>
    </div>
  )
}
