import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'

function ThreeHourForecast({ data }) {
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
  
  return (
    <Card>
      <Card.Content>
        <Card.Header>New React component</Card.Header>
        <p>Click <Link to="/current">here</Link> to go back to main page.</p>
      </Card.Content>
    </Card>
  )
}

export default ThreeHourForecast