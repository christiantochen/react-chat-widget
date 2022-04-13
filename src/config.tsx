export type ConfigType = {
  API_URL: string
  API_KEY: number
  IS_PRODUCTION: boolean
}

const Config: ConfigType = {
  API_URL: 'https://api.dev.goapp.co.id/v1',
  API_KEY: 61103364768840,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
}

export default Config
