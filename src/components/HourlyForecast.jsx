import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'
import { degreesToCardinal } from '../iconAndDataHandler';

function HourlyForecast({ weatherData }) {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(12)

  let hourlyGroup = weatherData.slice(startIndex, endIndex)

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

  function getTime(timestamp) {
    const dateObject = new Date(parseInt(timestamp, 10) * 1000)
    const options = {
      hour: "numeric",
      minute: "2-digit"
    }
    return dateObject.toLocaleTimeString("en-US", options)
  }

  useEffect(() => {
    const body = document.querySelector("html")
    body.style.height = "fit-content"
  })

  useEffect(() => console.log(startIndex, endIndex), [startIndex, endIndex])
  
  return (
    <Card style={{ minWidth: "750px" }}>
      <Card.Content>
        <Card.Header>Hourly Forecast</Card.Header>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {hourlyGroup.map(hour => (
          <div className="hourly-fcast">
            <h2>{getTime(hour["dt"])}</h2>
            <div className="weather-info">
              <div className="weather-condition">
                <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="" />
                <p>{hour.weather[0].description}</p>
              </div>
              <div className="temperature">
                <h1 style={{ fontSize: "2em" }}>{Math.round(hour.temp) + "\u00B0F"}</h1>
              </div>
              <div className="extra-info">
                <table id="details">
                  <tbody>
                    <tr>
                     <td className="left">Feels Like</td>
                     <td className="right">{Math.round(hour.feels_like) + "\u00B0F"}</td>
                    </tr>
                    <tr>
                     <td className="left">Humidity</td>
                     <td className="right">{hour.humidity + "%"}</td>
                    </tr>
                    <tr>
                     <td className="left">Wind speed</td>
                     <td className="right">
                      {`${degreesToCardinal(hour.wind_deg)} ${Math.round(hour.wind_speed)} mph`}
                     </td>
                    </tr> 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        <div className="nav-buttons">
          <div className="nav-btn" onClick={() => {
            if (startIndex !== 0) {
              setStartIndex(startIndex - 12)
              endIndex === undefined ? setEndIndex(startIndex) : setEndIndex(endIndex - 12)
            }
          }}>
            <i className="long arrow alternate left icon"></i>
            Previous
          </div>
          <div className="nav-btn" onClick={() => {
            if (endIndex !== undefined) {
              setStartIndex(startIndex + 12)
              endIndex + 12 > weatherData.length - 1 ? setEndIndex(undefined) : setEndIndex(endIndex + 12)
            }
          }}>
            Next
            <i className="long arrow alternate right icon"></i>
          </div>
        </div>
        <p>Click <Link to="/current">here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default HourlyForecast