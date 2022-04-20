type ConfigType = {
  apiUrl: string
  apiKey?: string | null
}

const Config: ConfigType = {
  apiUrl: 'https://api.dev.goapp.co.id/v1'
}

export const setConfig = (config?: {
  apiKey?: string | null
  apiUrl?: string | null
}) => {
  Object.assign(Config, {
    apiKey: config?.apiKey || Config.apiKey,
    apiUrl: config?.apiUrl || Config.apiUrl
  })
}

export default Config
