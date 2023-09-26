import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import config from "../config"
import Weather from "./components/Weather"
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import SearchCity from './components/SearchCity';

function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState(null);
  const [city, setCity] = useState("")

  useEffect(() => {
    async function fetchData() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      await fetch(`${config.geoApiURL}/reverse?lat=${lat}&lon=${long}&limit=3&appid=${config.apiKey}`)
      .then(res => res.json())
      .then(
        result => {
          setCity(result[0].name)
          console.log(result)
        }, 
        error => console.log("City could not be fetched: " + error)
      );

      // await fetch(`${config.geoApiURL}/direct?q=Elmont&limit=5&appid=${config.apiKey}`)
      //   .then(result => result.json())
      //   .then(
      //     res => {
      //       if (res.length === 0) {
      //         console.log("City not found")
      //       } else {
      //         console.log(res)
      //       }
      //     },
      //   )

      await fetch(`${config.apiURL}/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=imperial&appid=${config.apiKey}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod !== "400") {
          setData(result)
        }
      });
    }
    fetchData()
  }, [lat, long])

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Router>
      <div className="App">
        {(data !== null) ? (
          <Routes>
            <Route path="/" element={<Navigate to="/current" />} />
            <Route path="/search" element={<SearchCity />} />
            <Route path="/current" element={<Weather weatherData={data.current} city={city} />} />
            <Route path="/8-day-forecast" element={<DailyForecast weatherData={data.daily} />} />
            <Route path="/hourly-forecast" element={<HourlyForecast weatherData={data.hourly} />} />
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