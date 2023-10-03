import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import { Card } from 'semantic-ui-react'

function SearchCity() {
  const [dropdownDisplay, setDropdownDisplay] = useState("none")
  const [countriesList, setCountriesList] = useState(null)

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

    fetch(`http://api.geonames.org/searchJSON?q=united+states&name_startsWith=${capInputValue}&maxRows=10&username=${config.geoApiUsername}`)
      .then(result => result.json())
      .then(cities => {
        if (cities.geonames.length > 0) {
          setDropdownDisplay("block")
          dropdownMenu.current.innerHTML = ""
          cities.geonames.forEach(city => {
            const cityDiv = document.createElement("div");
            cityDiv.textContent = `${city.toponymName}, ${city.adminName1}, ${city.countryCode}`
            cityDiv.style.cursor = "pointer"
            cityDiv.addEventListener("click", () => navigate(`/current/${city.toponymName}/${city.adminCode1}/${city.countryCode}`))
            dropdownMenu.current.appendChild(cityDiv);
          });
        }
      })
      .catch(error => console.log(`Could not fetch cities: ${error}`))
  }

  useEffect(() => {
    fetch(`http://api.geonames.org/countryInfoJSON?username=${config.geoApiUsername}`)
      .then(result => result.json())
      .then(data => setCountriesList(data.geonames))
      .catch(error => "Error fetching cities: " + error)
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
      <select name="country" id="country-selection">
        {countriesList ? (countriesList.map(country => (<option key={country.geonameId}>{country.countryName}</option>))) : ""}
      </select>
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