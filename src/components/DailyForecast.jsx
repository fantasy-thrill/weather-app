import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'
import { degreesToCardinal } from '../utilities';

function FiveDayForecast({ weatherData }) {
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

  useEffect(() => {
    const body = document.querySelector("html")
    body.style.height = "fit-content"
  })

  return (
    <Card style={{ minWidth: "750px" }}>
      <Card.Content>
        <Card.Header className="header">Eight-Day Forecast</Card.Header>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {weatherData.map(weatherDay => (
          <div className="daily-fcast">
            <h2>{getDayOfWeek(weatherDay["dt"])}</h2>
            <div className="weather-info">
              <div className="weather-condition">
                <img src={`https://openweathermap.org/img/wn/${weatherDay.weather[0].icon}@2x.png`} alt="" />
                <p>{weatherDay.weather[0].description}</p>
              </div>
              <div className="temperature">
                <h1 style={{ fontSize: "2em" }}>{Math.round(weatherDay.temp.max) + "\u00B0F"}</h1>
              </div>
              <div className="extra-info">
                <table id="details">
                  <tbody>
                    <tr>
                     <td className="left">Feels Like</td>
                     <td className="right">{Math.round(weatherDay.feels_like.eve) + "\u00B0F"}</td>
                    </tr>
                    <tr>
                     <td className="left">Humidity</td>
                     <td className="right">{weatherDay.humidity + "%"}</td>
                    </tr>
                    <tr>
                     <td className="left">Wind speed</td>
                     <td className="right">
                      {`${degreesToCardinal(weatherDay.wind_deg)} ${Math.round(weatherDay.wind_speed)} mph`}
                     </td>
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