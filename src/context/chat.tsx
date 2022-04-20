import _ from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import Config from '../config'
import {
  getConversations as getConversationsApi,
  getConversationMessages as getConversationMessagesApi,
  sendMessage as sendMessageApi,
  startTyping as startTypingApi,
  markAsRead as markAsReadApi,
  newConversation as newConversationApi
} from '../api'
import { Conversation, Message } from '../lib/types'
import { useVisitor } from './visitor'

type State = {
  socket?: WebSocket
  isConnected: boolean
  conversations: Array<Conversation>
  messages: Array<Message>
  pendingMessages: Array<{
    id?: number
    localId: number
    conversationKey: string
    body: string
    isSending: boolean
  }>
  conversation?: Conversation
  newMessageCount: number
  sendMessage: (
    // eslint-disable-next-line no-unused-vars
    conversationKey: number,
    // eslint-disable-next-line no-unused-vars
    text: string,
    // eslint-disable-next-line no-unused-vars
    files?: Array<any>
  ) => Promise<any>
  // eslint-disable-next-line no-unused-vars
  startTyping: (conversationKey: number) => Promise<any>
  // eslint-disable-next-line no-unused-vars
  markAsRead: (conversationKey: number) => Promise<any>
  newConversation: () => Promise<any>
}

const initialState: State = {
  isConnected: false,
  conversations: [],
  messages: [],
  pendingMessages: [],
  newMessageCount: 0,
  // eslint-disable-next-line no-unused-vars
  sendMessage: (conversationKey: number, text: string, files?: Array<any>) =>
    Promise.resolve({}),
  // eslint-disable-next-line no-unused-vars
  startTyping: (conversationKey: number) => Promise.resolve({}),
  // eslint-disable-next-line no-unused-vars
  markAsRead: (conversationKey: number) => Promise.resolve({}),
  newConversation: () => Promise.resolve({})
}

export const ChatContext = React.createContext<State>(initialState)
ChatContext.displayName = 'ChatContext'

type Action =
  | {
      type: 'CLIENT_INITIALIZE'
      socket: WebSocket
      conversations: Array<Conversation>
      conversation: Conversation | undefined
      messages: Array<Message>
    }
  | { type: 'CLIENT_STATE_ON_CHANGE'; value: boolean }
  | { type: 'SERVER_NEW_MESSAGE'; value: Message }
  | { type: 'SERVER_UPDATE_CONVERSATION'; value: Conversation }
  | {
      type: 'SERVER_UPDATE_MESSAGES_AND_CONVERSATIONS'
      messages: Array<Message>
      conversation: Conversation
    }
  | {
      type: 'CLIENT_NEW_MESSAGE'
      value: {
        localId: number
        conversationKey: number
        body: string
        isSending: boolean
      }
    }

function reducer(state: State, action: Action) {
  console.log(action)
  switch (action.type) {
    case 'CLIENT_INITIALIZE': {
      return {
        ...state,
        socket: action.socket,
        conversations: _.values(
          _.merge(
            _.keyBy(state.conversations, 'id'),
            _.keyBy(action.conversations, 'id')
          )
        ),
        conversation: action.conversation,
        messages: _.values(
          _.merge(_.keyBy(state.messages, 'id'), _.keyBy(action.messages, 'id'))
        )
      }
    }
    case 'CLIENT_STATE_ON_CHANGE': {
      return { ...state, isConnected: action.value }
    }
    case 'SERVER_NEW_MESSAGE': {
      return {
        ...state,
        messages: _.values(
          _.merge(_.keyBy(state.messages, 'id'), _.keyBy([action.value], 'id'))
        ),
        pendingMessages: state.pendingMessages.filter(
          (message) => message.body !== action.value.body
        )
      }
    }
    case 'SERVER_UPDATE_CONVERSATION': {
      return {
        ...state,
        conversations: _.values(
          _.merge(
            _.keyBy(state.conversations, 'id'),
            _.keyBy([action.value], 'id')
          )
        ),
        conversation: action.value
      }
    }
    case 'SERVER_UPDATE_MESSAGES_AND_CONVERSATIONS': {
      return {
        ...state,
        conversations: _.values(
          _.merge(
            _.keyBy(state.conversations, 'id'),
            _.keyBy([action.conversation], 'id')
          )
        ),
        conversation: action.conversation,
        messages: _.values(
          _.merge(_.keyBy(state.messages, 'id'), _.keyBy(action.messages, 'id'))
        ),
        pendingMessages: state.pendingMessages.filter(
          (pendingMessage) =>
            !action.messages.some(
              (message) => message.body === pendingMessage.body
            )
        )
      }
    }
    case 'CLIENT_NEW_MESSAGE': {
      return {
        ...state,
        pendingMessages: _.values(
          _.merge(
            _.keyBy(state.pendingMessages, 'localId'),
            _.keyBy([action.value], 'localId')
          )
        )
      }
    }
  }
}

export const ChatProvider: FC = ({ ...props }): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { visitor_id } = useVisitor()
  const [reconnectingInterval, setReconnectingInterval] =
    useState<NodeJS.Timeout>()

  const sendMessage = (
    conversationKey: number,
    text: string,
    files?: Array<any>
  ) => {
    const localId = new Date().getTime()
    dispatch({
      type: 'CLIENT_NEW_MESSAGE',
      value: {
        localId,
        conversationKey,
        body: text,
        isSending: true
      }
    })
    return sendMessageApi({ conversationKey, text, files })
  }

  const startTyping = (conversationKey: number) =>
    startTypingApi(conversationKey)

  const markAsRead = (conversationKey: number) => markAsReadApi(conversationKey)

  const newConversation = () => newConversationApi()

  const memoValue = useMemo(
    () => ({
      ...state,
      sendMessage,
      startTyping,
      markAsRead,
      newConversation
    }),
    [state]
  )

  const initializeSocket = useCallback(async () => {
    if (visitor_id) {
      const conversations = (await getConversationsApi()).data
      const conversation =
        conversations && conversations.length > 0 ? conversations[0] : undefined
      let messages: Message[] = []
      if (conversation) {
        await getConversationMessagesApi(conversation.uid).then(
          ({ data }) => (messages = data?.message || [])
        )
      }

      const url = `${Config.apiUrl}/ws/conversation/`
        .concat(`?visitor=${visitor_id}`)
        .concat(`&api_key=${Config.apiKey}`)
        .replace('http://', 'ws://')
        .replace('https://', 'wss://')

      const socket = new WebSocket(url)

      socket.onopen = () =>
        dispatch({ type: 'CLIENT_STATE_ON_CHANGE', value: true })
      socket.onclose = () =>
        dispatch({ type: 'CLIENT_STATE_ON_CHANGE', value: false })
      socket.onerror = (ev) => console.log(ev, 'onerror')
      socket.onmessage = (ev) => {
        const { type, data } = JSON.parse(ev.data) as {
          type: string
          data: any
        }

        switch (type) {
          case 'new_message': {
            dispatch({ type: 'SERVER_NEW_MESSAGE', value: data })
            break
          }
          case 'update_conversation': {
            dispatch({ type: 'SERVER_UPDATE_CONVERSATION', value: data })
            break
          }
          case 'messages_updated': {
            dispatch({
              type: 'SERVER_UPDATE_MESSAGES_AND_CONVERSATIONS',
              messages: data.messages,
              conversation: data.conversation
            })
            break
          }
        }
      }

      dispatch({
        type: 'CLIENT_INITIALIZE',
        socket,
        conversations,
        conversation,
        messages
      })
    }
  }, [visitor_id])

  useEffect(() => {
    initializeSocket()
  }, [initializeSocket])

  useEffect(() => {
    if (visitor_id && (!state.socket || !state.isConnected)) {
      if (!reconnectingInterval)
        setReconnectingInterval(
          setInterval(() => {
            console.log(state.socket ? 'reconnecting' : 'connecting')
            initializeSocket()
          }, 5000)
        )
    } else {
      if (reconnectingInterval) {
        clearInterval(reconnectingInterval)
        setReconnectingInterval(undefined)
      }
    }
  }, [state.isConnected, visitor_id])

  useEffect(() => {
    window.ononline = () => {
      console.log('ononline')
      if (!state.socket || state.socket.readyState === state.socket.CLOSED)
        initializeSocket()
    }
    window.onoffline = () => {
      console.log('onoffline')
      state.socket?.close(4000, 'Connection Lost')
    }
  }, [state.socket, initializeSocket])

  return <ChatContext.Provider value={memoValue} {...props} />
}

export const useChat = () => {
  const context = React.useContext(ChatContext)
  if (context === undefined) {
    throw new Error(`useChat must be used within a ChatProvider`)
  }
  return context
}
