import { useState, useEffect } from "react";
import config from "../../config.js";
import { degreesToCardinal, displayIcon, getTime, setTwelveHour } from "../utilities.js";
import { Card, Loader } from "semantic-ui-react";
import React from "react";
function TwelveHourForecast({ lat, long, timeZone }) {
    const [currentTime, setCurrentTime] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [forecastArr, setForecastArr] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${config.apiKey}`);
                const data = await result.json();
                if (data.cod === "200") {
                    setWeatherData(data.list);
                }
                console.log(data, "twelve hour object");
            }
            catch (error) {
                console.log("Data could not be fetched: " + error);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        const dateObject = new Date();
        const options = {
            hour12: false,
            timeZone: timeZone,
            hour: "numeric",
            minute: "2-digit"
        };
        setCurrentTime(dateObject.toLocaleTimeString("en-GB", options));
    }, []);
    useEffect(() => {
        if (weatherData && currentTime.length !== 0) {
            setForecastArr(setTwelveHour(currentTime, weatherData, timeZone));
        }
    }, [currentTime, weatherData]);
    useEffect(() => {
        if (weatherData) {
            for (let i = 0; i <= 10; i++) {
                const dateObj = new Date(weatherData[i].dt * 1000);
                const timeString = dateObj.toLocaleTimeString("en-US", {
                    timeZone: timeZone,
                    hour: "numeric",
                    minute: "2-digit"
                });
                console.log(timeString);
            }
        }
    }, [weatherData]);
    useEffect(() => console.log(forecastArr, currentTime), [forecastArr, currentTime]);
    return (forecastArr ? (React.createElement(Card.Content, { id: "twelve-hour" }, forecastArr.map(period => {
        const description = period.weather[0].description;
        const newDescription = description.replace(description[0], description[0].toUpperCase());
        const currentHour = Number(currentTime.split(":")[0]);
        const index = forecastArr.indexOf(period);
        return (React.createElement("div", { className: "timeframe", key: period.dt },
            index === 0 ? (currentHour >= 0 && currentHour < 17 ? (React.createElement("h2", null, "Today")) : (React.createElement("h2", null, "Tonight"))) : (currentHour >= 0 && currentHour < 17 ? (React.createElement("h2", null, "Tonight")) : (React.createElement("h2", null, "Tomorrow"))),
            React.createElement("div", { className: "forecast-12hr" },
                React.createElement("div", { className: "weather-info-12hr" },
                    React.createElement("img", { src: displayIcon(period.weather[0]), alt: "", className: "weather-icon-12hr" }),
                    React.createElement("p", { className: "downsize" }, newDescription)),
                React.createElement("div", { className: "temperature-12hr" },
                    React.createElement("h1", null,
                        Math.round(period.main.temp),
                        "\u00B0F")),
                        React.createElement("div", { className: "table-12hr" },
                        React.createElement("table", null,
                          React.createElement("tbody", null,
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Feels like"),
                              React.createElement("td", { className: "right downsize" }, Math.round(period.main.feels_like) + "\u00B0F")
                            ),
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Wind speed"),
                              React.createElement("td", { className: "right downsize" }, `${degreesToCardinal(period.wind.deg)} ${Math.round(period.wind.speed)} mph`)
                            ),
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Wind gusts"),
                              React.createElement("td", { className: "right downsize" }, Math.round(period.wind.gust) + " mph")
                            )
                          )
                        ),
                        React.createElement("table", null,
                          React.createElement("tbody", null,
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Humidity"),
                              React.createElement("td", { className: "right downsize" }, period.main.humidity + "%")
                            ),
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Cloud cover"),
                              React.createElement("td", { className: "right downsize" }, period.clouds.all + "%")
                            ),
                            React.createElement("tr", null,
                              React.createElement("td", { className: "left downsize" }, "Chance of precipitation"),
                              React.createElement("td", { className: "right downsize" }, Math.round(period.pop * 100) + "%")
                            )
                          )
                        )
                      ))));
    }))) : (React.createElement(Loader, { active: true }, "Loading")));
}
export default TwelveHourForecast;
