import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from "react";
import Weather from "./components/Weather"
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import SearchCity from './components/SearchCity';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<SearchCity />} />
          <Route path="/current/:city/:state/:country" element={<Weather />} />
          <Route path="/8-day-forecast/:city/:state/:country" element={<DailyForecast />} />
          <Route path="/hourly-forecast/:city/:state/:country" element={<HourlyForecast />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App