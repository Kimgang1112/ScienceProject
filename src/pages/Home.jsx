import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <h1 id="title">무슨 기능을 사용하시겠습니까?</h1>
      <div id="f_div">
        <button onClick={() => navigate('/yudo')} id="f_button">
          유도량 변환
        </button>
        <button onClick={() => navigate('/prefix')} id="j_button">
          접두어 변환
        </button>
      </div>
    </div>
  )
}
