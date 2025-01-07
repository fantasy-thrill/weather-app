import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config.js';
function SearchCity() {
    const inputElem = useRef(null);
    const dropdownMenu = useRef(null);
    const navigate = useNavigate();
    function fetchData(inputValue) {
        fetch(`https://dataservice.accuweather.com/locations/v1/search?apikey=${config.geoApiKey}&q=${inputValue}&language=en-us`)
            .then(result => result.json())
            .then(cities => {
            const cleanList = cities.filter((location) => location["Type"] === "City");
            if (dropdownMenu.current) {
                if (cleanList.length > 0 && inputValue !== "") {
                    dropdownMenu.current.style.display = "block";
                    dropdownMenu.current.innerHTML = "";
                    for (let i = 0; i < 10; i++) {
                        const cityDiv = document.createElement("div");
                        cityDiv.textContent = `${cleanList[i]["EnglishName"]}, ${cleanList[i]["AdministrativeArea"]["EnglishName"]}, ${cleanList[i]["Country"]["EnglishName"]}`;
                        cityDiv.setAttribute("class", "city-choice");
                        const parameters = {
                            cityName: cleanList[i]["EnglishName"].toLowerCase(),
                            stateAbbr: cleanList[i]["AdministrativeArea"]["ID"].toLowerCase(),
                            countryAbbr: cleanList[i]["Country"]["ID"].toLowerCase()
                        };
                        cityDiv.addEventListener("click", () => navigate(`/current/${parameters.cityName}/${parameters.stateAbbr}/${parameters.countryAbbr}`));
                        dropdownMenu.current?.appendChild(cityDiv);
                    }
                }
                else {
                    dropdownMenu.current.style.display = "none";
                }
            }
        })
            .catch(error => console.log(`Could not fetch cities: ${error}`));
    }
    useEffect(() => {
        const page = document.querySelector("body");
        page?.setAttribute("id", "search-page-body");
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "header", style: { marginBottom: "1.50em" } },
            React.createElement("img", { src: "https://i.postimg.cc/W10SmZDF/weather-forecast.png", alt: "weather app icon", style: { width: "7.5em" } }),
            React.createElement("h1", null, "Weather App"),
            React.createElement("h4", { style: { marginBlockStart: "0.25em" } }, "Powered by the OpenWeather API")),
        React.createElement("p", null, "Enter a city in the search bar below."),
        React.createElement("div", { id: "search", style: { margin: "10px auto" } },
            React.createElement("input", { type: "text", id: "city-input", ref: inputElem, onChange: (e) => {
                    e.target.value === "" && dropdownMenu.current ? dropdownMenu.current.style.display = "none" : fetchData(e.target.value);
                } }),
            React.createElement("div", { id: "dropdown-menu", ref: dropdownMenu }),
            React.createElement("button", { type: "submit", id: "city-submit" }, "Search"))));
}
export default SearchCity;
