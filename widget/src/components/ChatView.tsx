import cn from 'clsx'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useChat } from 'react-chat'
import {
  getStatusByMessage,
  isSameStatusByMessage,
  getEventsByConversation
} from 'react-chat'
import ChatBody from './ChatBody'
import ChatHeader from './ChatHeader'

type ChatEvent = {
  id: number
  type: 'event' | 'date'
  eventDate: moment.Moment
  text: string
}

const ChatView: React.FC<{
  className?: string
  style?: React.CSSProperties
}> = ({ className, style }) => {
  const {
    isConnected,
    messages,
    sendMessage,
    pendingMessages,
    conversation,
    startTyping,
    markAsRead,
    newConversation
  } = useChat()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [typingAt, setTypingAt] = useState<Date>()
  const [agentTypingAt, setAgentTypingAt] = useState<Date>()
  const [agentTypingAtTimeout, setAgentTypingAtTimeout] =
    useState<NodeJS.Timeout>()
  const [chat, setChat] = useState<string>('')
  const [chatEvents, setChatEvent] = useState<Array<ChatEvent>>([])
  let chatEventAlreadyInAction = [] as Array<ChatEvent>

  // first time load keep scrolling to the (n-1)th element.
  // HACK: setTimeout solve this issue.
  const scrollToBottom = () =>
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight
      }
    }, 0)

  useEffect(() => {
    if (messages && messages.length > 0) {
      const message = messages[messages.length - 1]
      if (Boolean(message.sender.agent) && agentTypingAt) {
        setAgentTypingAt(undefined)
        if (agentTypingAtTimeout) {
          clearTimeout(agentTypingAtTimeout)
          setAgentTypingAtTimeout(undefined)
        }
      }
    }
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [pendingMessages])

  useEffect(() => {
    if (conversation) {
      const parties = conversation.parties.filter((party: any) =>
        Boolean(party.agent)
      )
      if (parties.length > 0) {
        const party = parties[0]
        const duration = moment
          .duration(moment().diff(party.typing_at))
          .asSeconds()

        if (duration < 8) {
          setAgentTypingAt(party.typing_at)
          setAgentTypingAtTimeout(
            setTimeout(() => {
              setAgentTypingAt(undefined)
              if (agentTypingAtTimeout) {
                clearTimeout(agentTypingAtTimeout)
                setAgentTypingAtTimeout(undefined)
              }
            }, 8000 - duration * 1000)
          )
        }
      }
    }
  }, [conversation])

  useEffect(() => {
    if (conversation) {
      setChatEvent(getEventsByConversation(conversation))

      if (conversation.new_count > 0 && !document.hidden) {
        markAsRead(conversation.uid)
      }
    }

    window.onfocus = () => {
      console.log('onfocus:conversation:new_count', conversation?.new_count)
      if (conversation && conversation.new_count > 0) {
        markAsRead(conversation.uid)
      }
    }
  }, [conversation])

  return (
    <div
      className={cn(
        'fixed right-4 left-1/2 rounded-lg shadow-lg bg-white',
        'flex flex-col',
        className
      )}
      style={style}
    >
      {/* Head */}
      <ChatHeader isConnected={isConnected} />
      {/* Body */}
      <div
        className='flex flex-col h-full overflow-y-auto'
        ref={chatContainerRef}
      >
        <div className='flex flex-col p-1 mt-auto'>
          {messages.map((chat, i: number) => {
            const isSelf = !Boolean(chat.sender.agent)
            const previousMessage = i > 0 ? messages[i - 1] : undefined
            const groupWithPrevious =
              previousMessage &&
              !Boolean(previousMessage.sender.agent) === isSelf &&
              isSameStatusByMessage(previousMessage, chat) &&
              moment
                .duration(
                  moment(chat.created_at).diff(previousMessage.created_at)
                )
                .asMinutes() <= 1
            const nextMessage =
              i + 1 < messages.length ? messages[i + 1] : undefined
            const groupWithNext =
              nextMessage &&
              !Boolean(nextMessage.sender.agent) === isSelf &&
              isSameStatusByMessage(nextMessage, chat) &&
              moment
                .duration(moment(nextMessage.created_at).diff(chat.created_at))
                .asMinutes() <= 1

            chatEventAlreadyInAction = _.xorBy(
              chatEvents.filter((chatEvent) =>
                chatEvent.eventDate.isBefore(moment(chat.created_at))
              ),
              chatEventAlreadyInAction,
              'id'
            )

            return (
              <ChatBody
                key={chat.id}
                isSelf={isSelf}
                groupWithPrevious={groupWithPrevious}
                groupWithNext={groupWithNext}
                events={chatEventAlreadyInAction}
                body={chat.body}
                status={getStatusByMessage(chat)}
                sentAt={chat.sent_at}
              />
            )
          })}
          {pendingMessages.map(
            (chat: {
              localId: number
              conversationKey: string
              body: string
              isSending: boolean
            }) => {
              return (
                <ChatBody
                  key={chat.localId}
                  body={chat.body}
                  isSelf={true}
                  isSending={chat.isSending}
                />
              )
            }
          )}
          {agentTypingAt && (
            <div className={cn('flex flex-col space-y-1 px-2 items-start')}>
              Is Typing...
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          'flex flex-row bg-white p-2 items-center space-x-2',
          'rounded-b-lg border-t border-t-slate-200'
        )}
      >
        <input
          className='w-full outline-none'
          placeholder='Tulis Pesan Anda'
          value={chat}
          onChange={(e) => {
            setChat(e.target.value)
            if (
              conversation &&
              (!typingAt ||
                moment.duration(moment().diff(typingAt)).asSeconds() >= 5)
            ) {
              setTypingAt(new Date())
              startTyping(conversation.uid)
            }
          }}
        />
        <button
          className='cursor-pointer'
          disabled={!chat || chat.length === 0}
          onClick={() => {
            if (conversation) {
              sendMessage(conversation.uid, chat)
            } else {
              newConversation().then(({ data }) => sendMessage(data.uid, chat))
            }
            setChat('')
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatView
