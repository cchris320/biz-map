import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Industry from './pages/Industry'
import Company from './pages/Company'
import Case from './pages/Case'
import Bubble from './pages/Bubble'
import Thermometer from './pages/Thermometer'
import Concept from './pages/Concept'
import Listening from './pages/Listening'
import './App.css'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/industry/:id" element={<Industry />} />
        <Route path="/company/:ticker" element={<Company />} />
        <Route path="/case/:ticker" element={<Case />} />
        <Route path="/bubble/:id" element={<Bubble />} />
        <Route path="/market" element={<Thermometer />} />
        <Route path="/concept" element={<Concept />} />
        <Route path="/listening" element={<Listening />} />
      </Routes>
    </HashRouter>
  )
}
