interface EnvTypes {
  apiURL: string,
  geoApiURL: string,
  apiKey: string,
  iconURL: string,
  geoApiUsername: string
}

const config: EnvTypes = {
  apiURL: import.meta.env.VITE_API_URL,
  geoApiURL: import.meta.env.VITE_GEO_API_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  iconURL: import.meta.env.VITE_ICON_URL,
  geoApiUsername: import.meta.env.VITE_GEO_API_USERNAME
}

export default config