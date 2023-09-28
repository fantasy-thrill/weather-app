export const icons = {
  sunny: "",
  clearNight: "",
  partlyCloudy: "",
  partlyCloudyNight: "",
  cloudy: "",
  rain: "",
  thunderstorms: "",
  snow: "",
  snowflake: "",
  fog: ""
}

export function displayIcon(obj) {
  const period = obj.weather[0].icon[2]

  switch (obj.weather[0].main) {
    case "Clear":
      if (period === "n") {
        return icons.clearNight
      } else {
        return icons.sunny
      }
      break;
    case "Clouds":
      if (obj.weather[0].description === "few clouds") {
        if (period === "n") {
          return icons.partlyCloudyNight
        } else {
          return icons.partlyCloudy
        }
      } else {
        return icons.cloudy
      }
      break;
    case "Rain":
      return icons.rain
      break;
    case "Thunderstorms":
      return icons.thunderstorms
      break;
    case "Snow":
      const severityRegex = /heavy/
      if (severityRegex.test(obj.weather[0].description)) {
        return icons.snowflake
      } else {
        return icons.snow
      }
      break;
    case "Fog":
    case "Mist":
      return icons.fog
      break;
  }
}

export function dateFormat(timestamp) {
  const dateStamp = new Date(parseInt(timestamp, 10) * 1000)
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }
  const longFormat = dateStamp.toLocaleString("en-US", options)
  return longFormat
}

export function degreesToCardinal(degrees) {
  const cardinalDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5);  
  const cardinalIndex = (index + 16) % 16;   
  return cardinalDirections[cardinalIndex];
}

 export function getBackgroundColor(data) {
  const weatherCode = data?.weather[0]?.id
  const period = data?.weather[0]?.icon[2]
  const description = data?.weather[0]?.description

  let backgroundColor = "#ffffff"

  if (period === "d") {
    if (weatherCode === 800 || weatherCode === 801) {
      backgroundColor = "#87ceeb"
    } else if (weatherCode >= 802 && weatherCode <= 804) {
      backgroundColor = "#A6B9C2"
    } else if (weatherCode >= 200 && weatherCode <= 531) {
      backgroundColor = "#7F888C"
    } else if (description.includes("snow") || description.includes("sleet")) {
      backgroundColor = "#C1CFD5"
    }
  }

  if (period === "n") {
    if (weatherCode === 800 || weatherCode === 801) {
      backgroundColor = "#3192F4"
    } else if (weatherCode >= 802 && weatherCode <= 804) {
      backgroundColor = "#2C77E5"
    } else if (weatherCode >= 200 && weatherCode <= 531) {
      backgroundColor = "#5B5B8E"
    } else if (description.includes("snow") || description.includes("sleet")) {
      backgroundColor = "#9191CE"
    }
  }

  return backgroundColor;
}

export function getCurrentDateAndTime() {
  const dateObject = new Date()
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }
  const currentTime = dateObject.toLocaleTimeString("en-US", options)
  return currentTime
}

export function getTime(timestamp, timeZone) {
  const dateObject = new Date(parseInt(timestamp, 10) * 1000)
  const options = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "2-digit"
  }
  return dateObject.toLocaleTimeString("en-US", options)
}

export function getDayOfWeek(timestamp) {
  const dateObject = new Date(parseInt(timestamp, 10) * 1000)
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  }
  return dateObject.toLocaleDateString("en-US", options)
}