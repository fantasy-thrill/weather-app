import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { displayIcon, getTime, getDayOfWeek, capitalizeName, degreesToCardinal, uvIndexFormat } from '../utilities';

function HourlyForecast() {
  const { city, state, country } = useParams()

  const [weatherData, setWeatherData] = useState(null)
  const [timeZone, setTimeZone] = useState("")
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(12)

  const navigate = useNavigate()
  let hourlyGroup = weatherData ? weatherData.slice(startIndex, endIndex) : null

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(
          `${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`
        )
        const res = await result.json()
        
        if (res.length === 0) {
          console.log("City not found")
        } else {
          const data = await fetch(
            `${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`
          )
          const obj = await data.json()

          if (obj.cod !== "400") {
            setWeatherData(obj.hourly)
            setTimeZone(obj.timezone)
            console.log(obj.hourly)
          }
        }
      } catch (error) {
        console.log('Weather data not fetched: ' + error);
      }
    }
    fetchData()
  }, [city, state, country])

  useEffect(() => {
    const body = document.querySelector("body")
    body.setAttribute("id", "hourly-and-daily")
  }, [])
  
  return (
    <Card style={{ minWidth: "40em" }}>
      <Card.Content className="heading">
        {country === "us" ? (
          <Card.Header>{capitalizeName(city)}, {state.toUpperCase()}</Card.Header>
        ) : (
          <Card.Header>{capitalizeName(city)}, {country.toUpperCase()}</Card.Header>
        )}
        <p style={{ fontSize: "0.75em", color: "#a9a9a9" }}>Hourly forecast</p>
      </Card.Content>
      <Card.Content style={{ padding: "0" }}>
        <div className="options">
          <div className="choice" onClick={() => navigate(`/current/${city}/${state}/${country}`)}>
            Current Weather
            <i className="sun icon"></i>
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
            Search another city
            <i className="search icon"></i>
          </div>
        </div>
      </Card.Content>
      <Card.Content style={{ padding: 0, animation: 'opac 0.8s' }}>
        {hourlyGroup ? (hourlyGroup.map(hour => {
          const description = hour.weather[0].description
          const newDescription = description.replace(description[0], description[0].toUpperCase())

          return (
            <React.Fragment key={hour.dt}>
              {getTime(hour.dt, true, timeZone) === "12:00 AM" ? (<div className="new-day">{getDayOfWeek(hour.dt, "long")}</div>) : ""}
              <div className="hourly-fcast">
                <div className="weather-info">
                  <div>
                    <i className="angle right icon" onClick={(e) => {
                      e.target.classList.toggle("active")
                      const parentDiv = e.target.closest(".hourly-fcast")
                      const extraConditions = parentDiv.querySelector(".extra-info")
                      extraConditions.classList.toggle("flex-displayed")
                    }}></i>
                  </div>
                  <div>
                    <p>{getTime(hour.dt, true, timeZone)}</p>
                  </div>
                  <div className="weather-condition">
                    <img src={displayIcon(hour)} alt="" id="weather-icon"/>
                    <p>{newDescription}</p>
                  </div>
                  <div className="temperature">
                    <h1 style={{ fontSize: "2em" }}>{Math.round(hour.temp) + "\u00B0F"}</h1>
                  </div>
                  <div className="main-info">
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
                <div className="extra-info">
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="left">Wind gusts</td>
                          <td className="right">{`${Math.round(hour.wind_gust)} mph`}</td>
                        </tr>
                        <tr>
                          <td className="left">Cloud cover</td>
                          <td className="right">{hour.clouds}%</td>
                        </tr>
                        <tr>
                          <td className="left">Dew point</td>
                          <td className="right">{Math.round(hour.dew_point)}&deg;F</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="left">UV Index</td>
                          <td className="right">{uvIndexFormat(hour.uvi)}</td>
                        </tr>
                        <tr>
                          <td className="left">Chance of precipitation</td>
                          <td className="right">{hour.pop * 100}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })) : (<Loader>Loading</Loader>)}
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
      </Card.Content> 
    </Card>
  )
}

export default HourlyForecast