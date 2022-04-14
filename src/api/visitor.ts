import Cookies from 'js-cookie'
import Config from '../config'
import fetcher from '../lib/fetcher'

export const init = (body: {
  _origin: string
  _referrer: string
  _goid?: number
}) =>
  fetcher<{ _goid: number }>('visitor/api/init/').setConfig(Config).post(body)

export const register = (body: {
  _goid: number
  external_app?: string
  external_model?: string
  external_id?: number
  first_name?: string
  last_name?: string
  email?: string
  mobile_no?: string
}) =>
  fetcher<{ visitor_id: number }>('visitor/api/register/')
    .setConfig(Config)
    .setParams({ visitor_id: Cookies.get('visitor_id') })
    .post(body)

export const logEvent = (name: string, data: any) =>
  fetcher('visitor/api/log_event/')
    .setConfig(Config)
    .setParams({ visitor_id: Cookies.get('visitor_id') })
    .post({
      _goid: Cookies.get('_goid'),
      event_name: name,
      event_data: data,
    })
