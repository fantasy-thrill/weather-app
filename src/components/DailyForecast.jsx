import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import config from '../../config';
import { Card, Loader } from 'semantic-ui-react'
import { getDayOfWeek, degreesToCardinal, displayIcon } from '../utilities';

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
      <Card.Content>
        <Card.Header className="header">Eight-Day Forecast</Card.Header>
      </Card.Content>
      <Card.Content style={{ padding: 0 }}>
        {weatherData.map(weatherDay => (
          <div className="daily-fcast">
            <h2>{getDayOfWeek(weatherDay["dt"])}</h2>
            <div className="weather-info">
              <div className="weather-condition">
                <img src={displayIcon(weatherDay)} alt="" id="weather-icon" />
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
        <p>Click <Link to={`/current/${city}/${state}/${country}`}>here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
    ) : (<Loader>Loading</Loader>)
  )
}

export default FiveDayForecast