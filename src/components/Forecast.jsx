import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { Card } from 'semantic-ui-react'

function FiveDayForecast({weatherData}) {
  return (
    <div>
      <h1>New React component</h1>
      <p>Click <Link to="/current">here</Link> to go back to main page.</p>
    </div>
  )
}

export default FiveDayForecast