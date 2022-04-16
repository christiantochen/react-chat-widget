import Cookies from 'js-cookie'
import Config from '../config'
import fetcher from '../lib/fetcher'

export const getBusiness = () => {
  return fetcher(`/directory/api/business/0/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      visitor: Cookies.get('visitor_id'),
    })
}
