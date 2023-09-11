import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import config from "../config"
import Weather from "./components/Weather"
import FiveDayForecast from './components/Forecast';

function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      await fetch(`${config.apiURL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${config.apiKey}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        console.log(result);
      });
    }
    fetchData();
  }, [lat, long])

  return (
    <Router>
      <div className="App">
        {(typeof data.main != 'undefined') ? (
          <Routes>
            <Route path="/" element={<Navigate to="/current" />} />
            <Route path="/current" element={<Weather weatherData={data} />} />
            <Route path="/5-day-forecast" element={<FiveDayForecast weatherData={data} />} />
          </Routes>
         ) : (
          <div>
           <p>No data found</p>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App