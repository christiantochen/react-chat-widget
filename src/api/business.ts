import Cookies from 'js-cookie'
import Config from '../config'
import fetcher from '../lib/fetcher'

export const getBusiness = (options?: { visitor?: number }) => {
  return fetcher(`/directory/api/business/0/`)
    .setCookies(Cookies.get())
    .setConfig(Config)
    .get({ ...options })
}
