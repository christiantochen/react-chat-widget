import Config from '../config'
import fetcher from '../lib/fetcher'

export const init = (body: {
  _origin: string
  _referrer: string
  _goid?: number
}) =>
  fetcher<{ _goid: number }>('visitor/api/init/').setConfig(Config).post(body)

export const register = (
  body: {
    _goid: number
    external_app?: string
    external_model?: string
    external_id?: number
    first_name?: string
    last_name?: string
    email?: string
    mobile_no?: string
  },
  options?: { visitor_id?: number }
) =>
  fetcher<{ visitor_id: number }>('visitor/api/register/')
    .setConfig(Config)
    .setParams({ ...options })
    .post(body)

export const logEvent = (
  body: { name: string; data: any },
  options?: { _goid?: number; visitor_id?: number }
) =>
  fetcher('visitor/api/log_event/')
    .setConfig(Config)
    .setParams({ visitor_id: options?.visitor_id })
    .post({
      _goid: options?._goid,
      event_name: body.name,
      event_data: body.data
    })
