import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { degreesToCardinal, dateFormat, getBackgroundColor } from '../utilities';

function CurrentWeather() {
  const { city, state, country } = useParams()

  const [weatherData, setWeatherData] = useState(null)
  const [background, setBackground] = useState("")

  const description = weatherData ? weatherData.weather[0].description : null;
  const newDescription = weatherData ? description.replace(description[0], description[0].toUpperCase()) : null;
  const fahrenheit = weatherData ? Math.round(weatherData.temp) : null
  const feelsLike = weatherData ? Math.round(weatherData.feels_like) : null
  const windSpeed = weatherData ? Math.round(weatherData.wind_speed) : null

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      let fetchURL = country === "US" ? `${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}` :
      `${config.geoApiURL}/direct?q=${city},${country}&limit=5&appid=${config.apiKey}`

      await fetch(fetchURL)
      .then(result => result.json())
      .then(res => {
        if (res.length === 0) {
          console.log("City not found")
        } else {
           fetch(`${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`)
            .then(data => data.json())
            .then(obj => {
              if (obj.cod !== "400") {
                setWeatherData(obj.current)
                setBackground(getBackgroundColor(obj.current))
              }
            });
          }
      })
      .catch(error => console.log("Weather data not fetched: " + error))
    }
    fetchData()
  }, [city, state, country])

  useEffect(() => {
    const body = document.querySelector("body")
    body.setAttribute("id", "weather-body")
    body.style.backgroundColor = background
    console.log(background)
  }, [background])

  return (
    weatherData ? (
    <Card style={{ minWidth: "400px" }}>
      <Card.Content>
          <Card.Header className="header">{city}</Card.Header>
          <div>
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt=""
              id="weather-icon" 
            />
            <p>{newDescription}</p>
          </div>
          <h2 id="temperature">{fahrenheit + "\u00B0F"}</h2>          
          <table id="details">
            <tbody>
              <tr>
               <td className="left">Feels Like</td>
               <td className="right">{feelsLike + "\u00B0F"}</td>
              </tr>
              <tr>
               <td className="left">Humidity</td>
               <td className="right">{weatherData.humidity + "%"}</td>
              </tr>
              <tr>
               <td className="left">Wind speed</td>
               <td className="right">{`${degreesToCardinal(weatherData.wind_deg)} ${windSpeed} mph`}</td>
              </tr> 
            </tbody>
          </table>
          <p id="footer">Last updated {dateFormat(weatherData.dt)}</p>
      </Card.Content>
      <Card.Content style={{ padding: "0", borderTop: "none" }}>
        <div className="options">
          <div className="choice" onClick={() => window.location.reload()}>
            Refresh
            <i className="sync alternate icon"></i>
          </div>
          <div className="choice" onClick={() => navigate(`/hourly-forecast/${city}/${state}/${country}`)}>
            Hourly Forecast
            <i className="clock outline icon"></i>
          </div>
          <div className="choice" onClick={() => navigate(`/8-day-forecast/${city}/${state}/${country}`)}>
            Eight-Day Forecast
            <i className="calendar outline icon"></i>
          </div>
          <div className="choice" onClick={() => navigate("/search")}>
            Search
            <i className="search icon"></i>
          </div>
        </div>
      </Card.Content>
    </Card>) : (<Loader>Loading</Loader>)
   )
}

export default CurrentWeather;