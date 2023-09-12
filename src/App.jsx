import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import config from "../config"
import Weather from "./components/Weather"
import FiveDayForecast from './components/Forecast';

function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      await fetch(`${config.apiURL}/weather/?lat=${lat}&lon=${long}&units=imperial&APPID=${config.apiKey}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod !== "400") {
          setWeatherData(result)
        }
      });

      await fetch(`${config.apiURL}/forecast/?lat=${lat}&lon=${long}&units=imperial&APPID=${config.apiKey}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod !== "400") {
          setForecastData(result)
        }
      });
    }
    fetchData()
  }, [lat, long])

  useEffect(() => {
    console.log(weatherData, forecastData)
  }, [weatherData, forecastData])

  // useEffect(() => {
  //   if (forecastData !== null) {
  //     forecastData["list"].forEach(forecast => {
  //       const dateStamp = new Date(parseInt(forecast["dt"], 10) * 1000)
  //       const formattedDate = dateStamp.toLocaleDateString("en-US")
  //       const formattedTime = dateStamp.toLocaleTimeString("en-US")
  //       if (formattedTime === "11:00:00 AM") {
  //         console.log(formattedDate)
  //       }
  //     })
  //   }
  // }, [forecastData])

  return (
    <Router>
      <div className="App">
        {(weatherData !== null && forecastData !== null) ? (
          <Routes>
            <Route path="/" element={<Navigate to="/current" />} />
            <Route path="/current" element={<Weather data={weatherData} />} />
            <Route path="/5-day-forecast" element={<FiveDayForecast data={forecastData} />} />
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