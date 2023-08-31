import './App.css';
import React, { useEffect, useState } from "react";
import config from "../config"
import Weather from "./components/Weather"

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
    <div className="App">
      {(typeof data.main != 'undefined') ? (
        <Weather weatherData={data}/>
      ) : (
        <div>
          <p>No data found</p>
        </div>
      )}
    </div>
  )
}

export default App