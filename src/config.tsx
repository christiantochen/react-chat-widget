export type ConfigType = {
  API_URL: string
  API_KEY?: string | null
  IS_PRODUCTION: boolean
}

const Config: ConfigType = {
  API_URL: 'https://api.dev.goapp.co.id/v1',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
}

export const setConfig = (apiKey: string | null) => {
  Object.assign(Config, { ...Config, API_KEY: apiKey })
}

export default Config
