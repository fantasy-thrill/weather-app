import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from "react";
import CurrentWeather from "./compiled_js_components/CurrentWeather"
import DailyForecast from './compiled_js_components/DailyForecast';
import HourlyForecast from './compiled_js_components/HourlyForecast';
import SearchCity from './compiled_js_components/SearchCity';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<SearchCity />} />
          <Route path="/current/:city/:state/:country" element={<CurrentWeather />} />
          <Route path="/8-day-forecast/:city/:state/:country" element={<DailyForecast />} />
          <Route path="/hourly-forecast/:city/:state/:country" element={<HourlyForecast />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App