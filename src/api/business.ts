import Config from '../config'
import fetcher from '../lib/fetcher'

export const getBusiness = (options?: { visitor?: number }) => {
  return fetcher(`/directory/api/business/0/`)
    .setConfig(Config)
    .get({ ...options })
}
