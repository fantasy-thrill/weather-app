import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { getCurrentDateAndTime, getTime, degreesToCardinal } from '../utilities';

function HourlyForecast() {
  const { city, state, country } = useParams()

  const [weatherData, setWeatherData] = useState(null)
  const [timeZone, setTimeZone] = useState("")
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(12)

  let hourlyGroup = weatherData ? weatherData.slice(startIndex, endIndex) : null

  useEffect(() => {
    async function fetchData() {
      await fetch(`${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`)
      .then(result => result.json())
      .then(res => {
        if (res.length === 0) {
          console.log("City not found")
        } else {
           fetch(`${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`)
            .then(data => data.json())
            .then(obj => {
              if (obj.cod !== "400") {
                setWeatherData(obj.hourly)
                setTimeZone(obj.timezone)
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
    body.style.height = "fit-content"
  })

 // useEffect(() => console.log(startIndex, endIndex), [startIndex, endIndex])
  
  return (
    <Card style={{ minWidth: "40em" }}>
      <Card.Content>
        <Card.Header>Hourly Forecast</Card.Header>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {hourlyGroup ? (hourlyGroup.map(hour => (
          <div className="hourly-fcast">
            <h2>{getTime(hour["dt"], timeZone)}</h2>
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
        ))) : (<Loader>Loading</Loader>)}
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
        <p>Click <Link to={`/current/${city}/${state}/${country}`}>here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default HourlyForecast