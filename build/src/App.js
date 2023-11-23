import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import SearchCity from './components/SearchCity';
function App() {
    return (React.createElement(Router, null,
        React.createElement("div", { className: "App" },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/search" }) }),
                React.createElement(Route, { path: "/search", element: React.createElement(SearchCity, null) }),
                React.createElement(Route, { path: "/current/:city/:state/:country", element: React.createElement(CurrentWeather, null) }),
                React.createElement(Route, { path: "/8-day-forecast/:city/:state/:country", element: React.createElement(DailyForecast, null) }),
                React.createElement(Route, { path: "/hourly-forecast/:city/:state/:country", element: React.createElement(HourlyForecast, null) })))));
}
export default App;
