import Cookies from 'js-cookie'
import Config from '../config'
import fetcher from '../lib/fetcher'

export const getConversations = (
  filters?: { size?: number; offset: number },
  options?: { visitor?: number }
) =>
  fetcher(`conversation/api/conversation/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      ...options,
      ...{ size: 20, offset: 0, ...filters }
    })

export const getConversationDetail = (
  conversationKey: number,
  options?: { visitor?: number }
) =>
  fetcher(`conversation/api/conversation/${conversationKey}/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      ...options
    })

export const getConversationMessages = (
  conversationKey: number,
  filters?: { size: number; startFrom: number },
  options?: { visitor?: number }
) =>
  fetcher(`conversation/api/conversation/${conversationKey}/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      ...options,
      message_size: filters?.size || 20,
      message_start_from: filters?.startFrom || 0
    })

export const newConversation = (options?: { visitor?: number }) =>
  fetcher(`conversation/api/conversation/start/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ ...options })
    .post()

export const markAsRead = (
  conversationKey: number,
  options?: { visitor?: number }
) =>
  fetcher(`conversation/api/conversation/${conversationKey}/read_all/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ ...options })
    .post()

export const startTyping = (
  conversationKey: number,
  options?: { visitor?: number }
) =>
  fetcher(`conversation/api/conversation/${conversationKey}/start_typing/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ ...options })
    .post()

export const sendMessage = (
  {
    conversationKey,
    text,
    files
  }: {
    conversationKey: number
    text: string
    files?: Array<any>
  },
  options?: { visitor?: number }
) => {
  const body = new FormData()
  body.append('body', text)
  files?.map((file) => {
    body.append('attachments', file)
  })

  return fetcher(`conversation/api/message/send/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({
      ...options,
      conversation: conversationKey
    })
    .post(body)
}
