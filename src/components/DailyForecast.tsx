import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config.js';
import { Card, Loader } from 'semantic-ui-react'
import { getDayOfWeek, capitalizeName, degreesToCardinal, displayIcon, uvIndexFormat } from '../utilities.js';
import { Parameters, DailyForecastObject } from '../interfaces.js';

function DailyForecast() {
  const { city, state, country } = useParams<Parameters>()

  const [weatherData, setWeatherData] = useState<DailyForecastObject[] | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(
          `/geoapi/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`
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
            setWeatherData(obj.daily)
            console.log(obj.daily)
          }
        }
      } catch (error) {
        console.log('Weather data not fetched: ' + error);
      }
    }
    fetchData()
  }, [city, state, country])

  useEffect(() => {
    const body = document.querySelector("body");
    (body as HTMLBodyElement).setAttribute("id", "hourly-and-daily")
  }, [])

  return (
    <Card style={{ minWidth: "40em" }}>
      <Card.Content className="heading">
      {city && country ? (
          country === "us" && state ? (
          <Card.Header>{capitalizeName(city)}, {state.toUpperCase()}</Card.Header>
          ) : (
          <Card.Header>{capitalizeName(city)}, {country.toUpperCase()}</Card.Header>
          )
         ) : ""
        }
        <p style={{ fontSize: "0.75em", color: "#a9a9a9" }}>Eight-day forecast</p>
      </Card.Content>
      <Card.Content style={{ padding: "0" }}>
        <div className="options">
          <div className="choice" onClick={() => navigate(`/current/${city}/${state}/${country}`)}>
            <i className="sun icon"></i>
            Current Weather
          </div>
          <div className="choice" onClick={() => navigate(`/hourly-forecast/${city}/${state}/${country}`)}>
            <i className="clock outline icon"></i>
            Hourly Forecast
          </div>
          <div className="choice" onClick={() => navigate(`/8-day-forecast/${city}/${state}/${country}`)}>
            <i className="calendar outline icon"></i>
            Eight-Day Forecast
          </div>
          <div className="choice" onClick={() => navigate("/search")}>
            <i className="search icon"></i>
            Search another city
          </div>
        </div>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {weatherData ? (weatherData.map(weatherDay => {
          const description = weatherDay.weather[0].description
          const newDescription = description.replace(description[0], description[0].toUpperCase())

          return (
            <div className="daily-fcast" key={weatherDay.dt}>
              <div className="weather-info">
                <div>
                  <i className="angle right icon" onClick={(e) => {
                    (e.target as HTMLElement).classList.toggle("active")
                    const parentDiv = (e.target as HTMLElement).closest(".daily-fcast")
                    const extraConditions = parentDiv?.querySelector(".extra-info")
                    extraConditions?.classList.toggle("flex-displayed")
                  }}></i>
                </div>
                <div>{getDayOfWeek(weatherDay["dt"], "short")}</div>
                <div className="weather-condition">
                  <img src={displayIcon(weatherDay.weather[0])} alt="" id="weather-icon" />
                  <p>{newDescription}</p>
                </div>
                <div className="temperature">
                  <h1 style={{ fontSize: "1.5em" }}>
                    {Math.round(weatherDay.temp.max) + "\u00B0F"}
                     / <span className="low-temp">{Math.round(weatherDay.temp.min) + "\u00B0F"}</span>
                  </h1>
                </div>
                <div className="main-info">
                  <table style={{ margin: "0 auto", width: "80%" }}>
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
              <div className="extra-info">
                <div className="first-subtable">
                  <table>
                    <tbody>
                      <tr>
                        <td className="left">Wind gusts</td>
                        <td className="right">{`${Math.round(weatherDay.wind_gust)} mph`}</td>
                      </tr>
                      <tr>
                        <td className="left">Cloud cover</td>
                        <td className="right">{weatherDay.clouds}%</td>
                      </tr>
                      <tr>
                        <td className="left">Dew point</td>
                        <td className="right">{Math.round(weatherDay.dew_point)}&deg;F</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="second-subtable">
                  <table>
                    <tbody>
                      <tr>
                        <td className="left">UV Index</td>
                        <td className="right">{uvIndexFormat(weatherDay.uvi)}</td>
                      </tr>
                      <tr>
                        <td className="left">Chance of precipitation</td>
                        <td className="right">{Math.round(weatherDay.pop * 100)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })) : (<Loader>Loading...</Loader>)}
      </Card.Content>
    </Card>
  )
}

export default DailyForecast