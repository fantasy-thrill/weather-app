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