import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'
import { degreesToCardinal } from '../iconAndDataHandler';

function CurrentWeather() {
  const { city, state, country } = useParams()

//  const [cityDetails, setCityDetails] = useState(null)
  const [weatherData, setWeatherData] = useState({})
  const [periodOfDay, setPeriodOfDay] = useState("")

  const description = weatherData.weather[0].description;
  const newDescription = description.replace(description[0], description[0].toUpperCase())
  const fahrenheit = Math.round(weatherData.temp)
  const feelsLike = Math.round(weatherData.feels_like)
  const windSpeed = Math.round(weatherData.wind_speed)

  const navigate = useNavigate()
  const optionsStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.75em"
  }

  function dateFormat(timestamp) {
    const dateStamp = new Date(parseInt(timestamp, 10) * 1000)
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
    const longFormat = dateStamp.toLocaleString("en-US", options)
    return longFormat
  }

  function dayOrNight() {
    if (weatherData.weather[0].icon[2] === "d") {
      setPeriodOfDay("day")
    } else if (weatherData.weather[0].icon[2] === "n") {
      setPeriodOfDay("night")
    }
  }

  function setBackground() {
    const background = document.querySelector("body")
    const weatherCode = weatherData.weather[0].id

    if (periodOfDay === "day") {
      if (weatherCode === 800 || weatherCode === 801) {
        background.style.backgroundColor = "#87ceeb"
      } else if (weatherCode >= 802 && weatherCode <= 804) {
        background.style.backgroundColor = "#A6B9C2"
      } else if (weatherCode >= 200 && weatherCode <= 531) {
        background.style.backgroundColor = "#7F888C"
      } else if (description.includes("snow") || description.includes("sleet")) {
        background.style.backgroundColor = "#C1CFD5"
      }
    }

    if (periodOfDay === "night") {
      if (weatherCode === 800 || weatherCode === 801) {
        background.style.backgroundColor = "#3192F4"
      } else if (weatherCode >= 802 && weatherCode <= 804) {
        background.style.backgroundColor = "#2C77E5"
      } else if (weatherCode >= 200 && weatherCode <= 531) {
        background.style.backgroundColor = "#5B5B8E"
      } else if (description.includes("snow") || description.includes("sleet")) {
        background.style.backgroundColor = "#9191CE"
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetch(`${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`)
      .then(result => result.json())
      .then(res => {
        if (res.length === 0) {
          console.log("City not found")
        } else {
           fetch(`${config.apiURL}/onecall?lat=${res.lat}&lon=${res.long}&exclude=minutely&units=imperial&appid=${config.apiKey}`)
            .then(data => data.json())
            .then(obj => {
              if (obj.cod !== "400") {
                setWeatherData(obj.current)
              }
            });
          }
      })
      .catch(error => console.log("Weather data not fetched: " + error))
    }
    fetchData()
  }, [city, state, country])

  useEffect(() => {
    if (weatherData !== null) {
      dayOrNight()
    }
  }, [periodOfDay])

  useEffect(() => {
    if (weatherData.hasOwnProperty("weather")) { setBackground() }
  }, [weatherData])

  useEffect(() => {
    const page = document.querySelector("html")
    page.style.height = "100%"
  }, [])

  return (
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
        <div className="options" style={optionsStyle}>
          <div className="choice" onClick={() => window.location.reload()}>
            Refresh
            <i className="sync alternate icon"></i>
          </div>
          <div className="choice" onClick={() => navigate("/hourly-forecast")}>
            Hourly Forecast
            <i className="clock outline icon"></i>
          </div>
          <div className="choice" onClick={() => navigate("/8-day-forecast")}>
            Eight-Day Forecast
            <i className="calendar outline icon"></i>
          </div>
          <div className="choice" onClick={() => navigate("/search")}>
            Search
            <i className="search icon"></i>
          </div>
        </div>
      </Card.Content>
    </Card>
   )
}

export default CurrentWeather;