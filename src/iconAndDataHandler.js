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

export function degreesToCardinal(degrees) {
  const cardinalDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5);  
  const cardinalIndex = (index + 16) % 16;   
  return cardinalDirections[cardinalIndex];
}
