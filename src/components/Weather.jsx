import React, { useState } from 'react';
import '../App.css';
import { Card } from 'semantic-ui-react'

function CardExampleCard({weatherData}) {
  const weatherDescription = weatherData.weather[0].description;
  const capitalized = weatherDescription.replace(weatherDescription[0], weatherDescription[0].toUpperCase())
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
            <p>{capitalized}</p>
          </div>
          <h2 id="temperature">{fahrenheit + "\u00B0F"}</h2>             
          <p>Feels Like: {feelsLike + "\u00B0F"}</p>        
          <p>Humidity: {weatherData.main.humidity + "%"}</p>
          <p>Wind speed: {windSpeed + " mph"}</p>
          <p id="footer">Last updated {dateFormat(weatherData.dt)}</p>
      </Card.Content>
    </Card>
   )
}

export default CardExampleCard;