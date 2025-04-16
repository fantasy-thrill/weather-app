import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config.js';
import { Card, Loader } from 'semantic-ui-react';
import TwelveHourForecast from './TwelveHourForecast.js';
import { degreesToCardinal, dateFormat, getTime, getBackgroundImage, displayIcon, capitalizeName, uvIndexFormat, icons } from '../utilities.js';
function CurrentWeather() {
    const { city, state, country } = useParams();
    const [weatherData, setWeatherData] = useState(null);
    const [background, setBackground] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: 0, long: 0 });
    const description = weatherData ? weatherData.weather[0].description : null;
    const newDescription = weatherData ? description?.replace(description[0], description[0].toUpperCase()) : null;
    const fahrenheit = weatherData ? Math.round(weatherData.temp) : null;
    const feelsLike = weatherData ? Math.round(weatherData.feels_like) : null;
    const windSpeed = weatherData ? Math.round(weatherData.wind_speed) : null;
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            let fetchURL = country === 'us'
                ? `${config.geoApiURL}/direct?q=${city},${state},${country}&limit=5&appid=${config.apiKey}`
                : `${config.geoApiURL}/direct?q=${city},${country}&limit=5&appid=${config.apiKey}`;
            try {
                const result = await fetch(fetchURL);
                const res = await result.json();
                if (res.length === 0) {
                    console.log('City not found');
                }
                else {
                    const data = await fetch(`${config.apiURL}/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely&units=imperial&appid=${config.apiKey}`);
                    const obj = await data.json();
                    if (obj.cod !== '400') {
                        setWeatherData(obj.current);
                        setCoordinates(prevState => ({ ...prevState, lat: obj.lat, long: obj.lon }));
                        setBackground(getBackgroundImage(obj.current));
                        setTimeZone(obj.timezone);
                        console.log(obj.current, "current weather object");
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
        body.setAttribute("id", "weather-body");
        body.style.background = background;
    }, [background]);
    return (weatherData && (city && state && country) ? (React.createElement(Card, { id: "weather-card" },
        React.createElement(Card.Content, { className: "heading" },
            country === "us" ? (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                state.toUpperCase())) : (React.createElement(Card.Header, null,
                capitalizeName(city),
                ", ",
                country.toUpperCase())),
            React.createElement("p", { className: "subheader" }, "Current weather")),
        React.createElement(Card.Content, { style: { padding: "0" } },
            React.createElement("div", { className: "options" },
                React.createElement("div", { className: "choice", onClick: () => window.location.reload() },
                    React.createElement("i", { className: "sync alternate icon" }),
                    "Refresh"),
                React.createElement("div", { className: "choice", onClick: () => navigate(`/hourly-forecast/${city}/${state}/${country}`) },
                    React.createElement("i", { className: "clock outline icon" }),
                    "Hourly Forecast"),
                React.createElement("div", { className: "choice", onClick: () => navigate(`/8-day-forecast/${city}/${state}/${country}`) },
                    React.createElement("i", { className: "calendar outline icon" }),
                    "Eight-Day Forecast"),
                React.createElement("div", { className: "choice", onClick: () => navigate("/search") },
                    React.createElement("i", { className: "search icon" }),
                    "Search another city"))),
        React.createElement(Card.Content, { id: "main-weather" },
            React.createElement("div", { id: "main-weather-conditions" },
                React.createElement("img", { src: displayIcon(weatherData.weather[0]), alt: "", style: { width: "7.5em", margin: "0.5em" } }),
                React.createElement("p", null, newDescription),
                React.createElement("h2", { id: "temperature" }, fahrenheit + "\u00B0F"),
                React.createElement("p", { id: "footer" },
                    "Last updated ",
                    dateFormat(weatherData.dt))),
            React.createElement("div", null,
                React.createElement("table", { id: "main-weather-table" },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", { className: "left" }, "Feels Like"),
                            React.createElement("td", { className: "right" }, feelsLike + "\u00B0F")),
                        React.createElement("tr", null,
                            React.createElement("td", { className: "left" }, "Humidity"),
                            React.createElement("td", { className: "right" }, weatherData.humidity + "%")),
                        React.createElement("tr", null,
                            React.createElement("td", { className: "left" }, "Wind speed"),
                            React.createElement("td", { className: "right" }, `${degreesToCardinal(weatherData.wind_deg)} ${windSpeed} mph`)),
                        React.createElement("tr", null,
                            React.createElement("td", { className: "left" }, "Cloud cover"),
                            React.createElement("td", { className: "right" }, weatherData.clouds + "%")),
                        React.createElement("tr", null,
                            React.createElement("td", { className: 'left' }, "Dew point"),
                            React.createElement("td", { className: 'right' }, Math.round(weatherData.dew_point) + "\u00B0F")),
                        weatherData.weather[0].id >= 800 && weatherData.weather[0].id < 804 ? (React.createElement("tr", null,
                            React.createElement("td", { className: "left" }, "UV Index"),
                            React.createElement("td", { className: "right" }, uvIndexFormat(weatherData.uvi)))) : "")))),
        React.createElement(TwelveHourForecast, { lat: coordinates.lat, long: coordinates.long, timeZone: timeZone }),
        React.createElement(Card.Content, { id: "rise-and-set-container" },
            React.createElement("div", { className: "rise-and-set" },
                React.createElement("img", { src: icons.sunrise, alt: "sunrise", style: { width: "3em", margin: "0 auto" } }),
                React.createElement("div", { style: { textAlign: "left" } },
                    React.createElement("p", { style: { fontSize: "0.75em" } }, "Sunrise"),
                    React.createElement("p", { style: { fontSize: "1em", fontWeight: "bold" } }, getTime(weatherData.sunrise, timeZone)))),
            React.createElement("div", { className: "rise-and-set" },
                React.createElement("img", { src: icons.sunset, alt: "sunset", style: { width: "3em", margin: "0 auto" } }),
                React.createElement("div", { style: { textAlign: "left" } },
                    React.createElement("p", { style: { fontSize: "0.75em" } }, "Sunset"),
                    React.createElement("p", { style: { fontSize: "1em", fontWeight: "bold" } }, getTime(weatherData.sunset, timeZone))))))) : (React.createElement(Loader, { active: true }, "Loading")));
}
export default CurrentWeather;
