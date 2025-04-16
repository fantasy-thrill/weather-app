import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import config from '../../config.js';
import { Card, Loader } from 'semantic-ui-react';
import { displayIcon, getTime, getDayOfWeek, capitalizeName, degreesToCardinal, uvIndexFormat } from '../utilities.js';
function HourlyForecast() {
    const { city, state, country } = useParams();
    const [weatherData, setWeatherData] = useState(null);
    const [timeZone, setTimeZone] = useState("");
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(12);
    const navigate = useNavigate();
    let hourlyGroup = weatherData ? weatherData.slice(startIndex, endIndex) : null;
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch(`${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`);
                const res = await result.json();
                if (res.length === 0) {
                    console.log("City not found");
                }
                else {
                    const data = await fetch(`${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`);
                    const obj = await data.json();
                    if (obj.cod !== "400") {
                        setWeatherData(obj.hourly);
                        setTimeZone(obj.timezone);
                        console.log(obj.hourly);
                    }
                }
            }
            catch (error) {
                console.log('Weather data not fetched: ' + error);
            }
        }
        fetchData();
    }, [city, state, country]);
    useEffect(() => {
        const body = document.querySelector("body");
        body.setAttribute("id", "hourly-and-daily");
    }, []);
    return (React.createElement(Card, { id: "weather-card" },
        React.createElement(Card.Content, { className: "heading" },
            city && country ? (country === "us" && state ? (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                state.toUpperCase())) : (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                country.toUpperCase()))) : "",
            React.createElement("p", { className: "subheader" }, "Hourly forecast")),
        React.createElement(Card.Content, { style: { padding: "0" } },
            React.createElement("div", { className: "options" },
                React.createElement("div", { className: "choice", onClick: () => navigate(`/current/${city}/${state}/${country}`) },
                    React.createElement("i", { className: "sun icon" }),
                    "Current Weather"),
                React.createElement("div", { className: "choice", onClick: () => navigate(`/hourly-forecast/${city}/${state}/${country}`) },
                    React.createElement("i", { className: "clock outline icon" }),
                    "Hourly Forecast"),
                React.createElement("div", { className: "choice", onClick: () => navigate(`/8-day-forecast/${city}/${state}/${country}`) },
                    React.createElement("i", { className: "calendar outline icon" }),
                    "Eight-Day Forecast"),
                React.createElement("div", { className: "choice", onClick: () => navigate("/search") },
                    React.createElement("i", { className: "search icon" }),
                    "Search another city"))),
        React.createElement(Card.Content, { id: "hour-fcast-wrapper" },
            hourlyGroup ? (hourlyGroup.map(hour => {
                const description = hour.weather[0].description;
                const newDescription = description.replace(description[0], description[0].toUpperCase());
                return (React.createElement("div", { className: "hour-row", key: hour.dt },
                    getTime(hour.dt, timeZone) === "12:00 AM" ? (React.createElement("div", { className: "new-day" }, getDayOfWeek(hour.dt, "long"))) : "",
                    React.createElement("div", { className: "hourly-fcast" },
                        React.createElement("div", { className: "weather-info" },
                            React.createElement("div", null,
                                React.createElement("i", { className: "angle right icon", onClick: (e) => {
                                        e.target.classList.toggle("active");
                                        const parentDiv = e.target.closest(".hourly-fcast");
                                        const extraConditions = parentDiv?.querySelector(".extra-info");
                                        extraConditions?.classList.toggle("flex-displayed");
                                    } })),
                            React.createElement("div", null,
                                React.createElement("p", null, getTime(hour.dt, timeZone))),
                            React.createElement("div", { className: "weather-condition" },
                                React.createElement("img", { src: displayIcon(hour.weather[0]), alt: "", id: "weather-icon" }),
                                React.createElement("p", null, newDescription)),
                            React.createElement("div", { className: "temperature" },
                                React.createElement("h1", { style: { fontSize: "2em" } }, Math.round(hour.temp) + "\u00B0F")),
                            React.createElement("div", { className: "main-info" },
                                React.createElement("table", { id: "details" },
                                    React.createElement("tbody", null,
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Feels Like"),
                                            React.createElement("td", { className: "right" }, Math.round(hour.feels_like) + "\u00B0F")),
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Humidity"),
                                            React.createElement("td", { className: "right" }, hour.humidity + "%")),
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Wind speed"),
                                            React.createElement("td", { className: "right" }, `${degreesToCardinal(hour.wind_deg)} ${Math.round(hour.wind_speed)} mph`)))))),
                        React.createElement("div", { className: "extra-info" },
                            React.createElement("div", null,
                                React.createElement("table", null,
                                    React.createElement("tbody", null,
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Wind gusts"),
                                            React.createElement("td", { className: "right" }, `${Math.round(hour.wind_gust)} mph`)),
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Cloud cover"),
                                            React.createElement("td", { className: "right" },
                                                hour.clouds,
                                                "%")),
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Dew point"),
                                            React.createElement("td", { className: "right" },
                                                Math.round(hour.dew_point),
                                                "\u00B0F"))))),
                            React.createElement("div", null,
                                React.createElement("table", null,
                                    React.createElement("tbody", null,
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "UV Index"),
                                            React.createElement("td", { className: "right" }, uvIndexFormat(hour.uvi))),
                                        React.createElement("tr", null,
                                            React.createElement("td", { className: "left" }, "Chance of precipitation"),
                                            React.createElement("td", { className: "right" },
                                                hour.pop * 100,
                                                "%")))))))));
            })) : (React.createElement(Loader, null, "Loading")),
            React.createElement("div", { className: "nav-buttons" },
                weatherData && startIndex !== 0 ? (React.createElement("div", { className: "nav-btn", onClick: () => {
                        setStartIndex(startIndex - 12);
                        endIndex === undefined ? setEndIndex(startIndex) : setEndIndex(endIndex - 12);
                    } },
                    React.createElement("i", { className: "long arrow alternate left icon" }),
                    "Previous")) : "",
                weatherData && endIndex !== undefined ? (React.createElement("div", { className: "nav-btn", style: { margin: "0 0 0 auto" }, onClick: () => {
                        setStartIndex(startIndex + 12);
                        endIndex + 12 > weatherData.length - 1 ? setEndIndex(undefined) : setEndIndex(endIndex + 12);
                    } },
                    "Next",
                    React.createElement("i", { className: "long arrow alternate right icon" }))) : ""))));
}
export default HourlyForecast;
