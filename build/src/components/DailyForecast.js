import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config.js';
import { Card, Loader } from 'semantic-ui-react';
import { getDayOfWeek, capitalizeName, degreesToCardinal, displayIcon, uvIndexFormat } from '../utilities.js';
function DailyForecast() {
    const { city, state, country } = useParams();
    const [weatherData, setWeatherData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch(`/geoapi/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`);
                const res = await result.json();
                if (res.length === 0) {
                    console.log("City not found");
                }
                else {
                    const data = await fetch(`${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`);
                    const obj = await data.json();
                    if (obj.cod !== "400") {
                        setWeatherData(obj.daily);
                        console.log(obj.daily);
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
    return (React.createElement(Card, { style: { minWidth: "40em" } },
        React.createElement(Card.Content, { className: "heading" },
            city && country ? (country === "us" && state ? (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                state.toUpperCase())) : (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                country.toUpperCase()))) : "",
            React.createElement("p", { style: { fontSize: "0.75em", color: "#a9a9a9" } }, "Eight-day forecast")),
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
        React.createElement(Card.Content, { style: { padding: 0 } }, weatherData ? (weatherData.map(weatherDay => {
            const description = weatherDay.weather[0].description;
            const newDescription = description.replace(description[0], description[0].toUpperCase());
            return (React.createElement("div", { className: "daily-fcast", key: weatherDay.dt },
                React.createElement("div", { className: "weather-info" },
                    React.createElement("div", null,
                        React.createElement("i", { className: "angle right icon", onClick: (e) => {
                                e.target.classList.toggle("active");
                                const parentDiv = e.target.closest(".daily-fcast");
                                const extraConditions = parentDiv?.querySelector(".extra-info");
                                extraConditions?.classList.toggle("flex-displayed");
                            } })),
                    React.createElement("div", null, getDayOfWeek(weatherDay["dt"], "short")),
                    React.createElement("div", { className: "weather-condition" },
                        React.createElement("img", { src: displayIcon(weatherDay.weather[0]), alt: "", id: "weather-icon" }),
                        React.createElement("p", null, newDescription)),
                    React.createElement("div", { className: "temperature" },
                        React.createElement("h1", { style: { fontSize: "1.5em" } },
                            Math.round(weatherDay.temp.max) + "\u00B0F",
                            "/ ",
                            React.createElement("span", { className: "low-temp" }, Math.round(weatherDay.temp.min) + "\u00B0F"))),
                    React.createElement("div", { className: "main-info" },
                        React.createElement("table", { style: { margin: "0 auto", width: "80%" } },
                            React.createElement("tbody", null,
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Feels Like"),
                                    React.createElement("td", { className: "right" }, Math.round(weatherDay.feels_like.eve) + "\u00B0F")),
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Humidity"),
                                    React.createElement("td", { className: "right" }, weatherDay.humidity + "%")),
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Wind speed"),
                                    React.createElement("td", { className: "right" }, `${degreesToCardinal(weatherDay.wind_deg)} ${Math.round(weatherDay.wind_speed)} mph`)))))),
                React.createElement("div", { className: "extra-info" },
                    React.createElement("div", { className: "first-subtable" },
                        React.createElement("table", null,
                            React.createElement("tbody", null,
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Wind gusts"),
                                    React.createElement("td", { className: "right" }, `${Math.round(weatherDay.wind_gust)} mph`)),
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Cloud cover"),
                                    React.createElement("td", { className: "right" },
                                        weatherDay.clouds,
                                        "%")),
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Dew point"),
                                    React.createElement("td", { className: "right" },
                                        Math.round(weatherDay.dew_point),
                                        "\u00B0F"))))),
                    React.createElement("div", { className: "second-subtable" },
                        React.createElement("table", null,
                            React.createElement("tbody", null,
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "UV Index"),
                                    React.createElement("td", { className: "right" }, uvIndexFormat(weatherDay.uvi))),
                                React.createElement("tr", null,
                                    React.createElement("td", { className: "left" }, "Chance of precipitation"),
                                    React.createElement("td", { className: "right" },
                                        Math.round(weatherDay.pop * 100),
                                        "%"))))))));
        })) : (React.createElement(Loader, null, "Loading...")))));
}
export default DailyForecast;
