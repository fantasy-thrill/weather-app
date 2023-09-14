import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'

function FiveDayForecast({data}) {
  const [forecastArr, setForecastArr] = useState([])

  function getCurrentDateAndTime() {
    const dateObject = new Date()
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
    const currentTime = dateObject.toLocaleTimeString("en-US", options)
    return currentTime
  }

  function getForecast() {
    const cleanList = data["list"].filter(timePeriod => {
      const dateObject = new Date(parseInt(timePeriod["dt"], 10) * 1000)
      return dateObject.toLocaleTimeString("en-US") === "11:00:00 AM"
    });
    setForecastArr(cleanList)
  }

  useEffect(() => {
    if (forecastArr.length < 5) {
      getForecast()
    }
    console.log(forecastArr)
  }, [forecastArr])

  return (
    <Card>
      <Card.Content>
        <Card.Header className="header">Five-Day Forecast</Card.Header>
      </Card.Content>
      <Card.Content>
        <h1>Component construction in progress...</h1>
        <p>Click <Link to="/current">here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default FiveDayForecast