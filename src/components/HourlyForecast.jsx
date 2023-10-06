import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { displayIcon, getTime, degreesToCardinal } from '../utilities';

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
                console.log(obj.hourly)
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
    body.setAttribute("id", "hourly-and-daily")
  }, [])
  
  return (
    <Card style={{ minWidth: "35em" }}>
      <Card.Content className="heading">
        {country === "US" ? (
          <Card.Header>{city}, {state}</Card.Header>
        ) : (
          <Card.Header>{city}, {country}</Card.Header>
        )}
        <p style={{ fontSize: "0.75em", color: "#a9a9a9" }}>Hourly forecast</p>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {hourlyGroup ? (hourlyGroup.map(hour => (
          <div className="hourly-fcast" key={hour.dt}>
            <h2>{getTime(hour["dt"], timeZone)}</h2>
            <div className="weather-info">
              <div className="weather-condition">
                <img src={displayIcon(hour)} alt="" id="weather-icon"/>
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
          {startIndex !== 0 ? (
            <div className="nav-btn" onClick={() => {
              setStartIndex(startIndex - 12)
              endIndex === undefined ? setEndIndex(startIndex) : setEndIndex(endIndex - 12)
            }}>
              <i className="long arrow alternate left icon"></i>
              Previous
            </div>
          ) : ""}
          {endIndex !== undefined ? (
            <div className="nav-btn" style={{ margin: "0 0 0 auto" }} onClick={() => {
              setStartIndex(startIndex + 12)
              endIndex + 12 > weatherData.length - 1 ? setEndIndex(undefined) : setEndIndex(endIndex + 12)
            }}>
              Next
              <i className="long arrow alternate right icon"></i>
            </div>
          ) : ""}
        </div>
        <p style={{ margin: "0.75em 0"}}>Click <Link to={`/current/${city}/${state}/${country}`}>here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default HourlyForecast