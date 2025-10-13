import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import YudoConverter from './pages/YudoConverter'
import PrefixConverter from './pages/PrefixConverter'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/yudo" element={<YudoConverter />} />
      <Route path="/prefix" element={<PrefixConverter />} />
    </Routes>
  )
}
