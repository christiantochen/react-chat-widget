export type ConfigType = {
  API_URL: string
  API_KEY?: string | null
}

const Config: ConfigType = {
  API_URL: 'https://api.dev.goapp.co.id/v1'
}

export const initConfig = (config?: {
  apiKey?: string | null
  apiUrl?: string | null
}) => {
  Object.assign(Config, {
    API_KEY: config?.apiKey,
    API_URL: config?.apiUrl || 'https://api.dev.goapp.co.id/v1'
  })
}

export default Config
