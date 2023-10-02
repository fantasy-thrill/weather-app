import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import { Card } from 'semantic-ui-react'

function SearchCity() {
  const [dropdownDisplay, setDropdownDisplay] = useState("none")

  const inputElem = useRef()
  const dropdownMenu = useRef()
  const navigate = useNavigate()

  const styles = {
    searchDiv: {
      margin: "10px auto",
    },
    dropdown: {
      position: "absolute",
      backgroundColor: "silver",
      border: "1px solid",
      display: dropdownDisplay,
      width: "20em"
    }
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

  useEffect(() => {
    const selection = document.getElementById("country-selection")
    selection.innerHTML = ""

    fetch("http://api.geonames.org/countryInfoJSON?username=tempguy200")
      .then(result => result.json())
      .then(data => data.geonames.forEach(country => {
        const option = document.createElement("option")
        option.textContent = country.countryName
        selection.appendChild(option)
      }))
      .catch(error => "Error fetching US cities: " + error)
  }, [])

  useEffect(() => {
    const page = document.querySelector("html")
    page.style.height = "100%"
  }, [])

  return (
    <>
      <div id="header" style={{ marginBottom: "1.50em"}}>
        <h1>Weather App</h1>
        <h4 style={{ marginBlockStart: "0.25em" }}>Powered by the OpenWeather API</h4>
      </div>
      <p>Select your country then enter your city in the search bar below.</p>
      <select name="country" id="country-selection"></select>
      <div id="search" style={styles.searchDiv}>
        <input type="text" id="city-input" ref={inputElem} onChange={(e) => {
          e.target.value === "" ? setDropdownDisplay("none") : fetchData(e.target.value)
        }} />
        <div id="dropdown-menu" style={styles.dropdown} ref={dropdownMenu}></div>
        <button type="submit" id="city-submit">Search</button>
      </div>
    </>
  )
}

export default SearchCity