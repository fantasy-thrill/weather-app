import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { getDayOfWeek, capitalizeName, degreesToCardinal, displayIcon, uvIndexFormat } from '../utilities';

function FiveDayForecast() {
  const { city, state, country } = useParams()

  const [weatherData, setWeatherData] = useState(null)

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
                setWeatherData(obj.daily)
                console.log(obj.daily)
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
    weatherData ? (
    <Card style={{ minWidth: "40em" }}>
      <Card.Content className="heading">
        {country === "us" ? (
          <Card.Header>{capitalizeName(city)}, {state.toUpperCase()}</Card.Header>
        ) : (
          <Card.Header>{capitalizeName(city)}, {country.toUpperCase()}</Card.Header>
        )}
        <p style={{ fontSize: "0.75em", color: "#a9a9a9" }}>Eight-day forecast</p>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {weatherData.map(weatherDay => (
          <div className="daily-fcast">
            <div className="weather-info">
              <div>{getDayOfWeek(weatherDay["dt"], "short")}</div>
              <div className="weather-condition">
                <img src={displayIcon(weatherDay)} alt="" id="weather-icon" />
                <p>{weatherDay.weather[0].description}</p>
              </div>
              <div className="temperature">
                <h1 style={{ fontSize: "1.5em", textAlign: "right" }}>
                  {Math.round(weatherDay.temp.max) + "\u00B0F"} / <span className="low-temp">{Math.round(weatherDay.temp.min) + "\u00B0F"}</span>
                </h1>
              </div>
              <div className="extra-info">
                <table style={{ margin: "0 1em 0 auto", width: "80%" }}>
                  <tbody>
                    <tr>
                     <td className="left">Feels Like</td>
                     <td className="right">{Math.round(weatherDay.feels_like.eve) + "\u00B0F"}</td>
                    </tr>
                    {weatherDay.clouds >= 85 ? (<tr>
                      <td className="left">Humidity</td>
                      <td className="right">{weatherDay.humidity + "%"}</td>
                    </tr>) : (<tr>
                      <td className="left">UV Index</td>
                      <td className="right">{uvIndexFormat(weatherDay.uvi)}</td>
                    </tr>)}
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
        <p>Click <Link to={`/current/${city}/${state}/${country}`}>here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
    ) : (<Loader>Loading</Loader>)
  )
}

export default FiveDayForecast