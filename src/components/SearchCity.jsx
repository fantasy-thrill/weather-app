import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import { setSearchQuery } from '../utilities';
import { Card } from 'semantic-ui-react'

function SearchCity() {
  const [dropdownDisplay, setDropdownDisplay] = useState("none")
  const [countriesList, setCountriesList] = useState(null)
  const [country, setCountry] = useState("")

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
    fetch(`http://api.geonames.org/searchJSON?q=${country}&name_startsWith=${inputValue}&maxRows=10&username=${config.geoApiUsername}`)
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
    fetch(`http://api.geonames.org/countryInfoJSON?username=${config.geoApiUsername}`)
      .then(result => result.json())
      .then(data => setCountriesList(data.geonames))
      .catch(error => "Error fetching countries: " + error)
  }, [])

  useEffect(() => console.log(country), [country])

  useEffect(() => {
    const page = document.querySelector("body")
    page.setAttribute("id", "search-page-body")
  }, [])

  return (
    <>
      <div id="header" style={{ marginBottom: "1.50em"}}>
        <h1>Weather App</h1>
        <h4 style={{ marginBlockStart: "0.25em" }}>Powered by the OpenWeather API</h4>
      </div>
      <p>Select your country then enter your city in the search bar below.</p>
      <select name="country" id="country-selection" onChange={e => setCountry(setSearchQuery(e.target.value))}>
        <option value="" disabled selected>Select your country...</option>
        {countriesList ? (countriesList.map(country => (
          <option 
            key={country.geonameId}
            value={country.countryName}>
            {country.countryName}
          </option>
        ))) : ""}
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