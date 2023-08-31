import React from 'react';
import '../App.css';
import { Card } from 'semantic-ui-react'

function CardExampleCard({weatherData}) {
  const weatherDescription = weatherData.weather[0].description;
  const capitalized = weatherDescription.replace(weatherDescription[0], weatherDescription[0].toUpperCase())

  return (
    <Card>
      <Card.Content>
          <Card.Header className="header">City: {weatherData.name}</Card.Header>
          <p>Temprature: {weatherData.main.temp}</p>
          <p>Description: {capitalized}</p>
      </Card.Content>
    </Card>
   )
}

export default CardExampleCard;