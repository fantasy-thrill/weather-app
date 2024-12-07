import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config.js';
import { FetchCity } from '../interfaces.js';

function SearchCity() {
  const inputElem = useRef<HTMLInputElement | null>(null)
  const dropdownMenu = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  function fetchData(inputValue: string) {
    fetch(`/.netlify/functions/proxy-fetch?startsWith=${inputValue}&username=${config.geoApiUsername}`)
      .then(result => result.json())
      .then(cities => {
        if (dropdownMenu.current) {
          if (cities.geonames.length > 0 || inputValue !== "") {
            dropdownMenu.current.style.display = "block";
            dropdownMenu.current.innerHTML = "";
            (cities.geonames as FetchCity[]).forEach(city => {
              const cityDiv = document.createElement("div");
              cityDiv.textContent = `${city.toponymName}, ${city.adminName1}, ${city.countryCode}`
              cityDiv.setAttribute("class", "city-choice")

              const parameters = {
                cityName: city.toponymName.toLowerCase(),
                stateAbbr: city.adminCode1.toLowerCase(),
                countryAbbr: city.countryCode.toLowerCase()
              }
              cityDiv.addEventListener("click", () => navigate(`/current/${parameters.cityName}/${parameters.stateAbbr}/${parameters.countryAbbr}`))
              dropdownMenu.current?.appendChild(cityDiv);
            });
          } else {
          dropdownMenu.current.style.display = "none"
          }
        }
      })
      .catch(error => console.log(`Could not fetch cities: ${error}`))
  }

  useEffect(() => {
    const page = document.querySelector("body");
    page?.setAttribute("id", "search-page-body")
  }, [])

  return (
    <>
      <div id="header" style={{ marginBottom: "1.50em" }}>
        <img src={"https://i.postimg.cc/W10SmZDF/weather-forecast.png"} alt="weather app icon" style={{ width: "7.5em" }} />
        <h1>Weather App</h1>
        <h4 style={{ marginBlockStart: "0.25em" }}>Powered by the OpenWeather API</h4>
      </div>
      <p>Enter a city in the search bar below.</p>
      <div id="search" style={{ margin: "10px auto" }}>
        <input type="text" id="city-input" ref={inputElem} onChange={(e) => {
          e.target.value === "" && dropdownMenu.current ? dropdownMenu.current.style.display = "none" : fetchData(e.target.value)
        }} />
        <div id="dropdown-menu" ref={dropdownMenu}></div>
        <button type="submit" id="city-submit">Search</button>
      </div>
    </>
  )
}

export default SearchCity