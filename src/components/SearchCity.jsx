import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import config from '../../config';
import { Card } from 'semantic-ui-react'

function SearchCity() {
//  const [inputValue, setInputValue] = useState("")
  const [dropdownDisplay, setDropdownDisplay] = useState("none")

  const inputElem = useRef()
  const dropdownMenu = useRef()
  const navigate = useNavigate()

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
    width: "20em"
  }

  function fetchData(inputValue) {
    const capitalLetter = inputValue[0].toUpperCase()
    const capInputValue = inputValue.replace(inputValue[0], capitalLetter)

    fetch(`${config.geoApiURL}/direct?q=${capInputValue}&limit=5&appid=${config.apiKey}`)
      .then(result => result.json())
      .then(cities => {
        if (cities.length > 0) {
          setDropdownDisplay("block")
          dropdownMenu.current.innerHTML = ""
          cities.forEach(city => {
            const cityDiv = document.createElement("div");
            if (city.state === undefined) {
              cityDiv.textContent = `${city.name}, ${city.country}`
            } else {
              cityDiv.textContent = `${city.name}, ${city.state} ${city.country}`
            }
            cityDiv.style.cursor = "pointer"
            cityDiv.addEventListener("click", () => navigate(`/current/${city.name}/${city.state}/${city.country}`))
            dropdownMenu.current.appendChild(cityDiv);
          });
        }
      })
      .catch(error => console.log(`Could not fetch cities: ${error}`))
  }

  return (
    <div style={divStyle}>
      <input type="text" style={inputStyle} ref={inputElem} onChange={(e) => {
        e.target.value === "" ? setDropdownDisplay("none") : fetchData(e.target.value)
      }} />
      <div id="dropdown-menu" style={dropdownStyle} ref={dropdownMenu}></div>
      <button type="submit" style={buttonStyle}>Search</button>
      <p>Click <Link to="/current">here</Link> to return to main page.</p>
    </div>
  )
}

export default SearchCity