import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'

function FiveDayForecast({ data }) {
  const [forecastArr, setForecastArr] = useState([])

  function getCurrentDateAndTime() {
    const dateObject = new Date()
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
    const currentTime = dateObject.toLocaleTimeString("en-US", options)
    return currentTime
  }

  function getDayOfWeek(timestamp) {
    const dateObject = new Date(parseInt(timestamp, 10) * 1000)
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
    return dateObject.toLocaleDateString("en-US", options)
  }

  function getForecast() {
    const cleanList = data["list"].filter(timePeriod => {
      const dateObject = new Date(parseInt(timePeriod["dt"], 10) * 1000)
      return dateObject.toLocaleTimeString("en-US") === "11:00:00 AM"
    });
    setForecastArr(cleanList)
  }

  useEffect(() => {
    if (forecastArr.length < 5) {
      getForecast()
    }
    console.log(forecastArr)
  }, [forecastArr])

  useEffect(() => {
    const body = document.querySelector("html")
    body.style.height = "fit-content"
  })

  return (
    <Card style={{ minWidth: "750px" }}>
      <Card.Content>
        <Card.Header className="header">Five-Day Forecast</Card.Header>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {forecastArr.map(weatherDay => (
          <div className="daily-fcast">
            <h2>{getDayOfWeek(weatherDay["dt"])}</h2>
            <div className="weather-info">
              <div className="weather-condition">
                <img src={`https://openweathermap.org/img/wn/${weatherDay.weather[0].icon}@2x.png`} alt="" />
                <p>{weatherDay.weather[0].description}</p>
              </div>
              <div className="temperature">
                <h1 style={{ fontSize: "2em" }}>{Math.round(weatherDay.main.temp) + "\u00B0F"}</h1>
              </div>
              <div className="extra-info">
                <table id="details">
                  <tbody>
                    <tr>
                     <td className="left">Feels Like</td>
                     <td className="right">{Math.round(weatherDay.main.feels_like) + "\u00B0F"}</td>
                    </tr>
                    <tr>
                     <td className="left">Humidity</td>
                     <td className="right">{weatherDay.main.humidity + "%"}</td>
                    </tr>
                    <tr>
                     <td className="left">Wind speed</td>
                     <td className="right">{Math.round(weatherDay.wind.speed) + " mph"}</td>
                    </tr> 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        <p>Click <Link to="/current">here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default FiveDayForecast