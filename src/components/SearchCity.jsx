import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card } from 'semantic-ui-react'

function SearchCity() {
 // const [inputValue, setInputValue] = useState("")

  const divStyle = {
    margin: "10px auto",
    backgroundColor: "gray",
  }

  const inputStyle = {
    width: "200px",
    fontSize: "24px"
  }

  const buttonStyle = {
    verticalAlign: "text-top",
    marginLeft: "10px",
    padding: "5px 10px"
  }

  function fetchData(inputValue) {
    const capitalLetter = inputValue[0].toUpperCase()
    const capInputValue = inputValue.replace(inputValue[0], capitalLetter)

    fetch(`${config.geoApiURL}/direct?q=${capInputValue}&limit=5&appid=${config.apiKey}`)
      .then(result => result.json())
      .then()
  }

  return (
    <div style={divStyle}>
      <input type="text" style={inputStyle}/>
      <button type="submit" style={buttonStyle}>Search</button>
      <p>Click <Link to="/current">here</Link> to return to main page.</p>
    </div>
  )
}

export default SearchCity