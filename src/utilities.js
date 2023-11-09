export function capitalizeName(city) {
    const capitalized = city
        .match(/\b\w+\b/g)
        ?.map(word => {
        const capWord = word.replace(word[0], word[0].toUpperCase());
        return capWord;
    });
    return capitalized?.join(" ") || "";
}
export const icons = {
    sunny: "https://i.postimg.cc/X7FVcxGQ/sun.png",
    clearNight: "https://i.postimg.cc/rs0HTnXb/crescent-moon.png",
    partlySunny: "https://i.postimg.cc/XvLmkBk2/partly-sunny.png",
    partlyCloudy: "https://i.postimg.cc/0ypLrBM1/partly-cloudy.png",
    partlyCloudyNight: "https://i.postimg.cc/Zq4XNxpB/partly-cloudy-night.png",
    cloudy: "https://i.postimg.cc/nzL5RVdn/cloud.png",
    rain: "https://i.postimg.cc/0jTByY9N/rain.png",
    thunderstorms: "https://i.postimg.cc/MpSzsR1x/thunder.png",
    snow: "https://i.postimg.cc/FFYF1h9t/snow.png",
    snowflake: "https://i.postimg.cc/fW1z91LV/snowflake.png",
    fog: "https://i.postimg.cc/wvbrSKPL/fog.png",
    sunrise: "https://i.postimg.cc/KjC4kdYG/sunrise.png",
    sunset: "https://i.postimg.cc/SQPnvzfB/sunset.png"
};
export function displayIcon(obj) {
    const period = obj.icon[2];
    switch (obj.main) {
        case "Clear":
            if (period === "n") {
                return icons.clearNight;
            }
            else {
                return icons.sunny;
            }
            break;
        case "Clouds":
            switch (obj.description) {
                case "few clouds":
                    if (period === "n") {
                        return icons.clearNight;
                    }
                    else {
                        return icons.partlySunny;
                    }
                    break;
                case "scattered clouds":
                case "broken clouds":
                    if (period === "n") {
                        return icons.partlyCloudyNight;
                    }
                    else {
                        return icons.partlyCloudy;
                    }
                    break;
                default:
                    return icons.cloudy;
            }
            break;
        case "Rain":
            return icons.rain;
            break;
        case "Thunderstorms":
            return icons.thunderstorms;
            break;
        case "Snow":
            const severityRegex = /heavy/;
            if (severityRegex.test(obj.description)) {
                return icons.snowflake;
            }
            else {
                return icons.snow;
            }
            break;
        case "Fog":
        case "Mist":
        case "Haze":
            return icons.fog;
            break;
        default:
            return "";
    }
}
export function dateFormat(timestamp) {
    const dateStamp = new Date(timestamp * 1000);
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    };
    const longFormat = dateStamp.toLocaleString("en-US", options);
    return longFormat;
}
export function degreesToCardinal(degrees) {
    const cardinalDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5);
    const cardinalIndex = (index + 16) % 16;
    return cardinalDirections[cardinalIndex];
}
export function getBackgroundColor(data) {
    const weatherCode = data?.weather[0]?.id;
    const period = data?.weather[0]?.icon[2];
    const description = data?.weather[0]?.description;
    let backgroundColor = "#ffffff";
    if (period === "d") {
        if (weatherCode === 800 || weatherCode === 801) {
            backgroundColor = "#87ceeb";
        }
        else if (weatherCode >= 802 && weatherCode <= 804) {
            backgroundColor = "#A6B9C2";
        }
        else if (weatherCode >= 200 && weatherCode <= 531) {
            backgroundColor = "#7F888C";
        }
        else if (description.includes("snow") || description.includes("sleet")) {
            backgroundColor = "#C1CFD5";
        }
    }
    if (period === "n") {
        if (weatherCode === 800 || weatherCode === 801) {
            backgroundColor = "#3192F4";
        }
        else if (weatherCode >= 802 && weatherCode <= 804) {
            backgroundColor = "#2C77E5";
        }
        else if (weatherCode >= 200 && weatherCode <= 531) {
            backgroundColor = "#5B5B8E";
        }
        else if (description.includes("snow") || description.includes("sleet")) {
            backgroundColor = "#9191CE";
        }
    }
    return backgroundColor;
}
export function setWeatherBackground(data) {
    const background = document.getElementById("weather-body");
    if (background) {
        background.style.backgroundColor = getBackgroundColor(data);
    }
}
export function getCurrentDateAndTime() {
    const dateObject = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    };
    const currentTime = dateObject.toLocaleTimeString("en-US", options);
    return currentTime;
}
export function getTime(timestamp, timeZone, twentyFourHour = true) {
    const dateObject = new Date(timestamp * 1000);
    const options = {
        hour12: twentyFourHour,
        timeZone: timeZone,
        hour: "numeric",
        minute: "2-digit"
    };
    const local = twentyFourHour ? "en-US" : "en-GB";
    return dateObject.toLocaleTimeString(local, options);
}
export function getDayOfWeek(timestamp, length) {
    const dateObject = new Date(timestamp * 1000);
    const firstOptions = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };
    const secondOptions = {
        weekday: "short",
        month: "numeric",
        day: "numeric"
    };
    if (length === "short") {
        return dateObject.toLocaleDateString("en-US", secondOptions);
    }
    else {
        return dateObject.toLocaleDateString("en-US", firstOptions);
    }
}
export function uvIndexFormat(index) {
    const roundedIndex = Math.round(index);
    switch (roundedIndex) {
        case 0:
        case 1:
        case 2:
            return roundedIndex + " Low";
            break;
        case 3:
        case 4:
        case 5:
            return roundedIndex + " Moderate";
            break;
        case 6:
        case 7:
            return roundedIndex + " High";
            break;
        case 8:
        case 9:
        case 10:
            return roundedIndex + " Very High";
            break;
        default:
            return roundedIndex + " Extreme";
    }
}
export function isTimeWithinFrame(current, startHour, endHour) {
    const currentHourAndMin = current.split(":");
    const currentHour = Number(currentHourAndMin[0]);
    if (startHour > endHour) {
        return currentHour >= startHour || currentHour < endHour;
    }
    else {
        return currentHour >= startHour && currentHour < endHour;
    }
}
export function buildTwelveHour(objArr, startHour, endHour, timeZone) {
    const forecastArr = [];
    const equalHour = (obj, num, carryOver = false) => {
        const timeString = getTime(obj.dt, timeZone, false);
        const strHour = Number(timeString.split(":")[0]);
        if (startHour > endHour) {
            const current = new Date();
            current.setDate(current.getDate() + 1);
            const dayString = current.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
            });
            const nextDay = carryOver ? 
              strHour >= num && getDayOfWeek(obj.dt, "long") === dayString : 
              strHour >= num || getDayOfWeek(obj.dt, "long") === dayString
            
            return nextDay
        }
        else {
            return strHour >= num;
        }
    };
    const firstForecast = objArr.find((hour) => equalHour(hour, startHour));
    const secondForecast = objArr.find((hour) => equalHour(hour, endHour, true));
    if (firstForecast)
        forecastArr.push(firstForecast);
    if (secondForecast)
        forecastArr.push(secondForecast);
    return forecastArr;
}
export function setTwelveHour(current, objArr, timeZone) {
    if (isTimeWithinFrame(current, 0, 11)) {
        return buildTwelveHour(objArr, 11, 20, timeZone);
    }
    else if (isTimeWithinFrame(current, 11, 14)) {
        return buildTwelveHour(objArr, 14, 20, timeZone);
    }
    else if (isTimeWithinFrame(current, 14, 17)) {
        return buildTwelveHour(objArr, 16, 21, timeZone);
    }
    else if (isTimeWithinFrame(current, 17, 20)) {
        return buildTwelveHour(objArr, 20, 7, timeZone);
    }
    else if (isTimeWithinFrame(current, 20, 23)) {
        return buildTwelveHour(objArr, 22, 7, timeZone);
    }
    else if (isTimeWithinFrame(current, 23, 0)) {
        return buildTwelveHour(objArr, 1, 7, timeZone);
    }
    else {
        return [];
    }
}
