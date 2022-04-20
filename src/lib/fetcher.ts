export type FetcherResponse<T = any, E = any> = {
  ok: boolean
  status: number
  data: T
  error: E
}

const withQueryString = (url: RequestInfo, params?: any) => {
  if (!params) return url
  const keys = Object.keys(params)
  if (keys.length <= 0) return url
  const urlParams = keys
    .filter((key) => params[key] !== undefined)
    .map((key) => key + '=' + params[key])
    .join('&')

  if (urlParams) return `${url}?${urlParams}`

  return `${url}`
}

const withCookies = (cookies: any, options?: any) => {
  if (!cookies) return options

  const { token, business_uid } = cookies
  const headers = options?.headers || {}

  if (token) headers['Authorization'] = `Jwt ${token}`
  if (business_uid) headers['X-Service-Key'] = business_uid

  return { ...options, headers }
}

async function jsonParser<T = any>(
  resp: Response
): Promise<FetcherResponse<T>> {
  let data: T

  try {
    data = (await resp.json()) as T
  } catch {
    data = undefined as never
  }

  return { ok: resp.ok, status: resp.status, data, error: undefined as never }
}

async function errorParser<T = any, E = any>(
  e: any
): Promise<FetcherResponse<T, E>> {
  return {
    ok: false,
    status: 500,
    data: undefined as never,
    error: e.message as E
  }
}

function request<T = any, E = any>(
  url: RequestInfo,
  options?: RequestInit,
  config?: any
) {
  const requestOptions: any = {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers
    }
  }

  if (config?.apiKey) {
    requestOptions.headers['X-API-Key'] = config.apiKey
  }

  if (requestOptions.body) {
    if (requestOptions.body instanceof FormData) {
      delete requestOptions.headers['Content-Type']
    } else if (requestOptions.headers['Content-Type'] === 'application/json') {
      requestOptions.body = JSON.stringify(requestOptions.body)
    }
  }

  return fetch(`${config.apiUrl}/${url}`, requestOptions)
    .then((...props) => jsonParser<T>(...props))
    .catch((e) => errorParser<T, E>(e))
}

function fetcherWithCookiesParams<T = any, E = any>(
  url: RequestInfo,
  cookies?: string,
  params?: any,
  config?: any
) {
  return {
    get: (params?: any, options?: RequestInit) =>
      request<T, E>(
        withQueryString(url, params),
        withCookies(cookies, { ...options, method: 'GET' }),
        config
      ),
    post: (body?: any, options?: RequestInit) =>
      request<T, E>(
        withQueryString(url, params),
        withCookies(cookies, { ...options, body, method: 'POST' }),
        config
      ),
    put: (body?: any, options?: RequestInit) =>
      request<T, E>(
        withQueryString(url, params),
        withCookies(cookies, { ...options, body, method: 'PUT' }),
        config
      ),
    patch: (body?: any, options?: RequestInit) =>
      request<T, E>(
        withQueryString(url, params),
        withCookies(cookies, { ...options, body, method: 'PATCH' }),
        config
      ),
    delete: (options: RequestInit) => () =>
      request<T, E>(
        withQueryString(url, params),
        withCookies(cookies, { ...options, method: 'DELETE' }),
        config
      )
  }
}

export default function fetcher<T = any, E = any>(
  url: RequestInfo,
  options?: { cookies: any; params: any; config: any }
) {
  const setCookies = (cookies: any) =>
    fetcher<T, E>(url, {
      cookies,
      params: options?.params,
      config: options?.config
    })
  const setConfig = (config: any) =>
    fetcher<T, E>(url, {
      cookies: options?.cookies,
      params: options?.params,
      config
    })
  const setParams = (params: any) =>
    fetcher<T, E>(url, {
      cookies: options?.cookies,
      params,
      config: options?.config
    })

  return {
    setCookies,
    setConfig,
    setParams,
    ...fetcherWithCookiesParams<T, E>(
      url,
      options?.cookies,
      {
        visitor: options?.cookies?.visitor_id,
        ...options?.params
      },
      options?.config
    )
  }
}

export const simpleFetcher = (url: string, options?: any) =>
  request(url, options).then(({ data }) => data)
