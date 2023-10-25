import { useState, useEffect } from "react";
import config from "../../config";
import { degreesToCardinal, displayIcon, getCurrentDateAndTime, getTime, setTwelveHour, uvIndexFormat } from "../utilities";
import { Card, Loader } from "semantic-ui-react";

function TwelveHourForecast({ lat, long, timeZone }) {
  const [currentTime, setCurrentTime] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [forecastArr, setForecastArr] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${config.apiKey}`)
        const data = await result.json()

        if (data.cod === "200") {
          setWeatherData(data)
        }
        console.log(data, "twelve hour object")
      } catch (error) {
        console.log("Data could not be fetched: " + error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const dateObject = new Date()
    const options = {
      timeZone: timeZone,
      hour12: false,
      hour: "numeric",
      minute: "2-digit"
    }
    setCurrentTime(dateObject.toLocaleTimeString("en-GB", options))
  }, [])

  useEffect(() => {
    if (weatherData && currentTime.length !== 0) {
      setForecastArr(setTwelveHour(currentTime, weatherData.list, "America/New_York"))
    }
  }, [currentTime, weatherData])

  useEffect(() => {
    if (weatherData) {
      for (let i = 0; i <= 10; i++) {
        const dateObj = new Date(parseInt(weatherData.list[i].dt, 10) * 1000)
        const timeString = dateObj.toLocaleTimeString("en-US", {
          timeZone: timeZone,
          hour: "numeric",
          minute: "2-digit"
        })
        console.log(timeString)
      }
    }
  }, [weatherData])

  return (
    forecastArr ? (
      <Card.Content id="twelve-hour">
          {forecastArr.map(period => {
            const description = period.weather[0].description
            const newDescription = description.replace(description[0], description[0].toUpperCase()) 
            const currentHour = Number(currentTime.split(":")[0])
            const index = forecastArr.indexOf(period)

            return (
              <div className="timeframe">
                {index === 0 ? (
                  currentHour >= 0 && currentHour < 17 ? (<h2>Today</h2>) : (<h2>Tonight</h2>)
                ) : (currentHour >= 0 && currentHour < 17 ? (<h2>Tonight</h2>) : (<h2>Tomorrow</h2>))
                }
              <div className="forecast-12hr">
                <div className="weather-info-12hr">
                  <img src={displayIcon(period)} alt="" className="weather-icon-12hr" />
                  <p className="downsize">{newDescription}</p>
                </div>
                <div className="temperature-12hr">
                  <h1>{Math.round(period.main.temp)}&deg;F</h1>
                </div>
                <div className="table-12hr">
                  <table>
                    <tbody>
                      <tr>
                        <td className="left downsize">Feels like</td>
                        <td className="right downsize">{Math.round(period.main.feels_like)}&deg;F</td>
                      </tr>
                      <tr>
                        <td className="left downsize">Wind speed</td>
                        <td className="right downsize">{`${degreesToCardinal(period.wind.deg)} ${Math.round(period.wind.speed)} mph`}</td>
                      </tr>
                      <tr>
                        <td className="left downsize">Wind gusts</td>
                        <td className="right downsize">{Math.round(period.wind.gust)} mph</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="table-12hr">
                  <table>
                    <tbody>
                      <tr>
                        <td className="left downsize">Humidity</td>
                        <td className="right downsize">{period.main.humidity}%</td>
                      </tr>
                      <tr>
                        <td className="left downsize">Cloud cover</td>
                        <td className="right downsize">{period.clouds.all}%</td>
                      </tr>
                      <tr>
                        <td className="left downsize">Chance of precipitation</td>
                        <td className="right downsize">{Math.round(period.pop * 100)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )
          })}
      </Card.Content>
    ) : (<Loader active>Loading</Loader>)
  )
}

export default TwelveHourForecast