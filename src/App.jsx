import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import config from "../config"
import Weather from "./components/Weather"
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import SearchCity from './components/SearchCity';

function App() {
  useEffect(() => {
    fetch("http://api.geonames.org/searchJSON?q=united+states&name_startsWith=nas&username=tempguy200")
      .then(result => result.json())
      .then(data => {
        const filteredList = data.geonames.filter(country => country.fclName === "city, village,...")
        console.log(filteredList)
      })
      .catch(error => "Error fetching US cities: " + error)
  })

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