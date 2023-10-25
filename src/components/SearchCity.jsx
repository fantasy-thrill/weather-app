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
      backgroundColor: "#e7e7e7",
      border: "1px solid silver",
      display: dropdownDisplay,
      width: "20em"
    }
  }

  function fetchData(inputValue) {
    fetch(`http://api.geonames.org/searchJSON?q=united+states&name_startsWith=${inputValue}&maxRows=10&username=${config.geoApiUsername}`)
      .then(result => result.json())
      .then(cities => {
        if (cities.geonames.length > 0 || inputValue !== "") {
          setDropdownDisplay("block")
          dropdownMenu.current.innerHTML = ""
          cities.geonames.forEach(city => {
            const cityDiv = document.createElement("div");
            cityDiv.textContent = `${city.toponymName}, ${city.adminName1}, ${city.countryCode}`
            cityDiv.setAttribute("class", "city-choice")

            const parameters = {
              cityName: city.toponymName.toLowerCase(),
              stateAbbr: city.adminCode1.toLowerCase(),
              countryAbbr: city.countryCode.toLowerCase()
            }
            cityDiv.addEventListener("click", () => navigate(`/current/${parameters.cityName}/${parameters.stateAbbr}/${parameters.countryAbbr}`))
            dropdownMenu.current.appendChild(cityDiv);
          });
        }
      })
      .catch(error => console.log(`Could not fetch cities: ${error}`))
  }

  useEffect(() => {
    const page = document.querySelector("body")
    page.setAttribute("id", "search-page-body")
  }, [])

  return (
    <>
      <div id="header" style={{ marginBottom: "1.50em" }}>
        <img src={"https://i.postimg.cc/W10SmZDF/weather-forecast.png"} alt="weather app icon" style={{ width: "7.5em" }} />
        <h1>Weather App</h1>
        <h4 style={{ marginBlockStart: "0.25em" }}>Powered by the OpenWeather API</h4>
      </div>
      <p>Enter a city in the search bar below.</p>
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