import Cookies from 'js-cookie'
import Config from '../config'
import fetcher from '../lib/fetcher'

export const getConversations = (filters?: { size?: number; offset: number }) =>
  fetcher(`conversation/api/conversation/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      visitor: Cookies.get('visitor_id'),
      ...{ size: 20, offset: 0, ...filters },
    })

export const getConversationDetail = (conversationKey: number) =>
  fetcher(`conversation/api/conversation/${conversationKey}/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      visitor: Cookies.get('visitor_id'),
    })

export const getConversationMessages = (
  conversationKey: number,
  filters?: { size: number; startFrom: number }
) =>
  fetcher(`conversation/api/conversation/${conversationKey}/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .get({
      visitor: Cookies.get('visitor_id'),
      message_size: filters?.size || 20,
      message_start_from: filters?.startFrom || 0,
    })

export const newConversation = () =>
  fetcher(`conversation/api/conversation/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ visitor: Cookies.get('visitor_id') })
    .post()

export const markAsRead = (conversationKey: number) =>
  fetcher(`conversation/api/conversation/${conversationKey}/read_all/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ visitor: Cookies.get('visitor_id') })
    .post()

export const startTyping = (conversationKey: number) =>
  fetcher(`conversation/api/conversation/${conversationKey}/start_typing/`)
    .setConfig(Config)
    .setCookies(Cookies.get())
    .setParams({ visitor: Cookies.get('visitor_id') })
    .post()

export const sendMessage = (
  conversationKey: number,
  text: string,
  files?: Array<any>
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
      visitor: Cookies.get('visitor_id'),
      conversation: conversationKey,
    })
    .post(body)
}
