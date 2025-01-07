interface EnvTypes {
  apiURL: string,
  geoApiURL: string,
  apiKey: string,
  iconURL: string,
  geoApiKey: string
}

const config: EnvTypes = {
  apiURL: import.meta.env.VITE_API_URL,
  geoApiURL: import.meta.env.VITE_GEO_API_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  iconURL: import.meta.env.VITE_ICON_URL,
  geoApiKey: import.meta.env.VITE_GEO_API_KEY
}

export default config