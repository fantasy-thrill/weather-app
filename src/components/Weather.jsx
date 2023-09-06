import React, { useEffect, useState } from 'react';
import '../App.css';
import { Card, CardHeader } from 'semantic-ui-react'

function CurrentWeather({weatherData}) {
  const [periodOfDay, setPeriodOfDay] = useState("")

  const description = weatherData.weather[0].description;
  const newDescription = description.replace(description[0], description[0].toUpperCase())
  const fahrenheit = Math.round((weatherData.main.temp * 1.8) + 32)
  const feelsLike = Math.round((weatherData.main.feels_like * 1.8) + 32)
  const windSpeed = Math.round(2.23694 * weatherData.wind.speed)

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
      } else if (weatherDescription.includes("snow") || weatherDescription.includes("sleet")) {
        background.style.backgroundColor = "#C1CFD5"
      }
    }

    if (periodOfDay === "night") {
      if (weatherCode === 800 || weatherCode === 801) {
        background.style.backgroundColor = "#12125F"
      } else if (weatherCode >= 802 && weatherCode <= 804) {
        background.style.backgroundColor = "#9191CE"
      } else if (weatherCode >= 200 && weatherCode <= 531) {
        background.style.backgroundColor = "#5B5B8E"
      } else if (description.includes("snow") || weatherDescription.includes("sleet")) {
        background.style.backgroundColor = "#9191CE"
      }
    }
  }

  useEffect(() => {
    dayOrNight()
  }, [periodOfDay])

  useEffect(() => {
    if (weatherData.hasOwnProperty("weather")) { setBackground() }
  })

  return (
    <Card>
      <Card.Content>
          <Card.Header className="header">{weatherData.name}</Card.Header>
          <div>
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt=""
              id="weather-icon" 
            />
            <p>{newDescription}</p>
          </div>
          <h2 id="temperature">{fahrenheit + "\u00B0F"}</h2>
          <table id='details'>
            <tbody>
              <tr>
               <td className='left'>Feels Like</td>
               <td className='right'>{feelsLike + "\u00B0F"}</td>
              </tr>
              <tr>
               <td className='left'>Humidity</td>
               <td className='right'>{weatherData.main.humidity + "%"}</td>
              </tr>
              <tr>
               <td className='left'>Wind speed</td>
               <td className='right'>{windSpeed + " mph"}</td>
              </tr> 
            </tbody>
          </table>
          <p id="footer">Last updated {dateFormat(weatherData.dt)}</p>
      </Card.Content>
    </Card>
   )
}

export default CurrentWeather;