import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card } from 'semantic-ui-react'

function SearchCity() {
  const [inputValue, setInputValue] = useState("")
  const [dropdownDisplay, setDropdownDisplay] = useState("none")

  const inputElem = useRef()
  const dropdownMenu = useRef()

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

  const dropdownStyle = {
    position: "absolute",
    backgroundColor: "silver",
    border: "1px solid",
    display: dropdownDisplay,
  }

  function fetchData() {
    const capitalLetter = inputValue[0].toUpperCase()
    const capInputValue = inputValue.replace(inputValue[0], capitalLetter)

    fetch(`${config.geoApiURL}/direct?q=${capInputValue}&limit=5&appid=${config.apiKey}`)
      .then(result => result.json())
      .then(cities => {
        if (cities.length > 0) {
          setDropdownDisplay("block")
          return cities.map(city => 
            dropdownMenu.current.innerHTML = `<div>${city.name}, ${city.state} ${city.country}</div>`)
        }
      })
  }

  return (
    <div style={divStyle}>
      <input type="text" style={inputStyle} ref={inputElem} onInput={() => setInputValue()}/>
      <div id="dropdown-menu" style={dropdownStyle} ref={dropdownMenu}></div>
      <button type="submit" style={buttonStyle}>Search</button>
      <p>Click <Link to="/current">here</Link> to return to main page.</p>
    </div>
  )
}

export default SearchCity