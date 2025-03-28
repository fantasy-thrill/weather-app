import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config.js';
import { Card, Loader } from 'semantic-ui-react'
import TwelveHourForecast from './TwelveHourForecast.js';
import { 
  degreesToCardinal, 
  dateFormat,
  getTime, 
  getBackgroundColor, 
  displayIcon,
  capitalizeName, 
  uvIndexFormat, 
  icons } from '../utilities.js';
  import { Parameters, CoordinatesFormat, ForecastObject } from '../interfaces.js';

function CurrentWeather() {
  const { city, state, country } = useParams<Parameters>()

  const [weatherData, setWeatherData] = useState<ForecastObject | null>(null)
  const [background, setBackground] = useState<string>("")
  const [timeZone, setTimeZone] = useState<string>("")
  const [coordinates, setCoordinates] = useState<CoordinatesFormat>({ lat: 0, long: 0 })

  const description: string | null = weatherData ? weatherData.weather[0].description : null;
  const newDescription = weatherData ? description?.replace(description[0], description[0].toUpperCase()) : null;
  const fahrenheit = weatherData ? Math.round(weatherData.temp) : null
  const feelsLike = weatherData ? Math.round(weatherData.feels_like) : null
  const windSpeed = weatherData ? Math.round(weatherData.wind_speed) : null

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      let fetchURL =
        country === 'us'
          ? `/geoapi/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`
          : `/geoapi/direct?q=${city},${country}&limit=5&appid=${config.apiKey}`;
    
      try {
        const result = await fetch(fetchURL);
        const res = await result.json();
    
        if (res.length === 0) {
          console.log('City not found');
        } else {
          const data = await fetch(
            `${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`
          );
          const obj = await data.json();
    
          if (obj.cod !== '400') {
            setWeatherData(obj.current);
            setCoordinates(prevState => ({ ...prevState, lat: obj.lat, long: obj.lon }))
            setBackground(getBackgroundColor(obj.current));
            setTimeZone(obj.timezone);
            console.log(obj.current, "current weather object");
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
    (body as HTMLBodyElement).setAttribute("id", "weather-body");
    (body as HTMLBodyElement).style.background = background
  }, [background])

  return (
    weatherData && (city && state && country) ? (
    <Card style={{ minWidth: "40em" }}>
      <Card.Content className="heading">
        {country === "us" ? (
          <Card.Header>{capitalizeName(city)}, {state.toUpperCase()}</Card.Header>
        ) : (
          <Card.Header>{capitalizeName(city)}, {country.toUpperCase()}</Card.Header>
        )}
        <p className="subheader">Current weather</p>
      </Card.Content>
      <Card.Content style={{ padding: "0" }}>
        <div className="options">
          <div className="choice" onClick={() => window.location.reload()}>
            <i className="sync alternate icon"></i>
            Refresh
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
      <Card.Content style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ margin: "0 2.5em" }}>
            <img src={displayIcon(weatherData.weather[0])} alt="" style={{ width: "7.5em", margin: "0.5em" }} />
            <p>{newDescription}</p>
            <h2 id="temperature">{fahrenheit + "\u00B0F"}</h2>
            <p id="footer">Last updated {dateFormat(weatherData.dt)}</p>
          </div>
          <div>
            <table style={{ width: "90%" }}>
              <tbody>
                <tr>
                  <td className="left">Feels Like</td>
                  <td className="right">{feelsLike + "\u00B0F"}</td>
                </tr>
                <tr>
                 <td className="left">Humidity</td>
                 <td className="right">{weatherData.humidity + "%"}</td>
                </tr>
                <tr>
                 <td className="left">Wind speed</td>
                 <td className="right">{`${degreesToCardinal(weatherData.wind_deg)} ${windSpeed} mph`}</td>
                </tr>
                <tr>
                  <td className="left">Cloud cover</td>
                  <td className="right">{weatherData.clouds + "%"}</td>
                </tr>
                <tr>
                  <td className='left'>Dew point</td>
                  <td className='right'>{Math.round(weatherData.dew_point) + "\u00B0F"}</td>
                </tr>
                {weatherData.weather[0].id >= 800 && weatherData.weather[0].id < 804 ? (
                 <tr>
                  <td className="left">UV Index</td>
                  <td className="right">{uvIndexFormat(weatherData.uvi)}</td>
                 </tr>) : ""
                }
              </tbody>
            </table>
          </div>
      </Card.Content>
      <TwelveHourForecast lat={coordinates.lat} long={coordinates.long} timeZone={timeZone}/>
      <Card.Content style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div className="rise-and-set">
          <img src={icons.sunrise} alt="sunrise" style={{ width: "3em", margin: "0 auto" }} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "0.75em" }}>Sunrise</p>
            <p style={{ fontSize: "1em", fontWeight: "bold" }}>{getTime(weatherData.sunrise, timeZone)}</p>
          </div>
        </div>
        <div className="rise-and-set">
          <img src={icons.sunset} alt="sunset" style={{ width: "3em", margin: "0 auto" }} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "0.75em" }}>Sunset</p>
            <p style={{ fontSize: "1em", fontWeight: "bold" }}>{getTime(weatherData.sunset, timeZone)}</p>
          </div>
        </div>
      </Card.Content>
    </Card>) : (<Loader active>Loading</Loader>)
   )
}

export default CurrentWeather;