import { useState, useEffect } from "react";
import config from "../../config";
import { getCurrentDateAndTime, getTime } from "../utilities";
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
      hour: "numeric",
      minute: "2-digit"
    }
    setCurrentTime(dateObject.toLocaleTimeString("en-US", options))
  }, [])

  return (
    weatherData ? (
      <Card.Content>
        <div className="timeframe">{currentTime}</div>
        <div className="timeframe">
          {weatherData ? (
            "The data is here. First time: " + getTime(weatherData.list[0].dt, timeZone)
            ) : "There is no data"
          }
        </div>
      </Card.Content>
    ) : (<Loader active>Loading</Loader>)
  )
}

export default TwelveHourForecast