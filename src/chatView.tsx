import cn from 'clsx'
import _ from 'lodash'
import moment from 'moment'
import { FC, useEffect, useRef, useState } from 'react'
import { useChat } from './chatContext'
import { Message } from './lib/types'

const ChatView: FC = () => {
  const {
    isConnected,
    messages,
    sendMessage,
    pendingMessages,
    conversation,
    startTyping,
    markAsRead,
    newConversation,
  } = useChat()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [typingAt, setTypingAt] = useState<Date>()
  const [agentTypingAt, setAgentTypingAt] = useState<Date>()
  const [agentTypingAtTimeout, setAgentTypingAtTimeout] =
    useState<NodeJS.Timeout>()
  const [chat, setChat] = useState<string>('')
  const [chatEvents, setChatEvent] = useState<
    Array<{
      id: number
      type: 'event' | 'date'
      event_date: moment.Moment
      text: string
    }>
  >([])

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

  // setup agent typing event
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

  // Setup Events
  useEffect(() => {
    if (conversation) {
      let events = [] as Array<{
        id: number
        type: 'event' | 'date'
        event_date: moment.Moment
        text: string
      }>
      if (conversation.queued_at) {
        const queued_at = moment(conversation.queued_at)
        events.push({
          id: events.length + 1,
          type: 'event',
          event_date: queued_at,
          text: `Transfered to ${conversation.queue.name} at ${queued_at.format(
            'ddd, D MMM YYYY HH:mm'
          )}`,
        })
      }
      if (conversation.assigned_at) {
        const assigned_at = moment(conversation.assigned_at)
        const assigned_to = `${conversation.assigned_to.first_name} ${
          conversation.assigned_to.last_name || ''
        }`
        events.push({
          id: events.length + 1,
          type: 'event',
          event_date: assigned_at,
          text: `Assigned to ${assigned_to} at ${assigned_at.format(
            'ddd, D MMM YYYY HH:mm'
          )}`,
        })
      }
      if (conversation.closed_at) {
        const closed_at = moment(conversation.closed_at)
        const closed_by = conversation.closed_by
          ? `${conversation.closed_by.first_name} ${
              conversation.closed_by.last_name || ''
            }`
          : 'System'
        events.push({
          id: events.length + 1,
          type: 'event',
          event_date: closed_at,
          text: `Ended by ${closed_by} at ${closed_at.format(
            'ddd, D MMM YYYY HH:mm'
          )}}`,
        })
      }
      if (conversation.last_message) {
        const created_at = moment(conversation.last_message.created_at).startOf(
          'day'
        )
        const different_in_day = created_at.diff(
          moment(conversation.created_at).startOf('day'),
          'days'
        )

        Array(different_in_day)
          .fill(different_in_day)
          .forEach((_, index) => {
            const day_at = moment(conversation.created_at)
              .startOf('day')
              .add(index + 1, 'day')

            events.push({
              id: events.length + 1,
              type: 'date',
              event_date: day_at,
              text: moment().isSame(day_at, 'day')
                ? 'Today'
                : day_at.format('ddd, D MMM YYYY'),
            })
          })
      }

      setChatEvent(events)
    }
  }, [conversation])

  // Setup onfocus
  useEffect(() => {
    window.onfocus = () => {
      console.log('onfocus:conversation:new_count', conversation?.new_count)
      if (conversation && conversation.new_count > 0) {
        markAsRead(conversation.uid)
      }
    }
  }, [conversation])

  // Setup onfocus
  useEffect(() => {
    if (conversation && conversation.new_count > 0 && !document.hidden) {
      markAsRead(conversation.uid)
    }
  }, [conversation])

  const getStatus = (chat: Message) => {
    if (chat.read_at) return 'read'
    else if (chat.delivered_at) return 'delivered'
    else if (chat.dispatched_at) return 'sent'
    else return 'pending'
  }

  let chatEventAlreadyInAction = [] as Array<{
    id: number
    type: 'event' | 'date'
    event_date: moment.Moment
    text: string
  }>

  return (
    <div
      className={cn(
        'fixed top-4 right-4 bottom-24 left-1/3 rounded-lg shadow-lg bg-white',
        'flex flex-col'
      )}
    >
      {/* Head */}
      <div
        className={cn(
          'flex flex-col p-4 space-y-1 bg-slate-600',
          'border-b border-b-solid border-b-slate-200',
          'rounded-t-lg'
        )}
      >
        <div className={cn('font-bold text-white')}>Agent</div>
        <div className="flex flex-row items-center space-x-2">
          <div
            className={cn('rounded-full w-3 h-3', {
              'bg-rose-600': !isConnected,
              'bg-green-600': isConnected,
            })}
          />
          <div className="text-xs text-white text-opacity-75">
            {isConnected ? 'Connected' : 'Connecting'}
          </div>
        </div>
      </div>
      {/* Body */}
      <div
        className="flex flex-col h-full overflow-y-auto"
        ref={chatContainerRef}
      >
        <div className="flex flex-col p-1 mt-auto">
          {conversation && (
            <div
              key={messages.length + '_events'}
              className="w-full text-center space-y-1 mb-2"
            >
              <label className="text-xs bg-slate-200 rounded p-1">
                {moment(conversation.created_at).isSame(moment())
                  ? 'Today'
                  : moment(conversation.created_at).format('ddd, D MMM YYYY')}
              </label>
              <div className="text-xs block">
                {`Started ${
                  conversation.initiated_by?.contact &&
                  `By ${conversation.initiated_by.contact.first_name} ${
                    conversation.initiated_by.contact.last_name || ''
                  }`
                } at ${moment(conversation.created_at).format('LLLL')}`}
              </div>
            </div>
          )}
          {messages.map((chat, i: number) => {
            const isSelf = !Boolean(chat.sender.agent)
            const previousMessage = i > 0 ? messages[i - 1] : undefined
            const shouldGroupWithPreviousMessage =
              previousMessage &&
              !Boolean(previousMessage.sender.agent) === isSelf &&
              getStatus(previousMessage) === getStatus(chat) &&
              moment
                .duration(
                  moment(chat.created_at).diff(previousMessage.created_at)
                )
                .asMinutes() <= 1
            const nextMessage =
              i + 1 < messages.length ? messages[i + 1] : undefined
            const shouldGroupWithNextMessage =
              nextMessage &&
              !Boolean(nextMessage.sender.agent) === isSelf &&
              getStatus(nextMessage) === getStatus(chat) &&
              moment
                .duration(moment(nextMessage.created_at).diff(chat.created_at))
                .asMinutes() <= 1

            const events = _.xorBy(
              chatEvents.filter((chatEvent) =>
                chatEvent.event_date.isBefore(moment(chat.created_at))
              ),
              chatEventAlreadyInAction,
              'id'
            )
            chatEventAlreadyInAction = [...chatEventAlreadyInAction, ...events]

            return (
              <div
                key={chat.id}
                className={cn('flex flex-col space-y-1 px-2', {
                  'items-end': isSelf,
                  'items-start': !isSelf,
                  'mb-2': !shouldGroupWithNextMessage,
                  'mb-0.5': shouldGroupWithNextMessage,
                })}
              >
                {events &&
                  events.map((event) => {
                    if (event.type === 'event')
                      return (
                        <div
                          key={chat.id + '_' + event.id}
                          className={cn('text-xs block self-center')}
                        >
                          {event.text}
                        </div>
                      )

                    return (
                      <div
                        key={chat.id + '_' + event.id}
                        className={cn(
                          'text-xs bg-slate-200 rounded p-1 self-center'
                        )}
                      >
                        {event.text}
                      </div>
                    )
                  })}
                <div
                  className={cn('flex flex-col p-2', {
                    'bg-emerald-200': isSelf,
                    'bg-slate-200': !isSelf,
                    'rounded-tr-xl rounded-tl-xl':
                      !shouldGroupWithPreviousMessage,
                    'rounded-bl-xl': isSelf && !shouldGroupWithNextMessage,
                    'rounded-br-xl': !isSelf && !shouldGroupWithNextMessage,
                  })}
                  style={{ maxWidth: '75%' }}
                >
                  {!shouldGroupWithPreviousMessage && (
                    <div className="text-sm font-bold">
                      {isSelf ? 'You' : 'Agent'}
                    </div>
                  )}
                  <div className="text-sm break-words">{chat.body}</div>
                </div>
                {!shouldGroupWithNextMessage && (
                  <div className="text-xs">
                    {chat.sent_at && moment(chat.sent_at).format('HH:mm')}
                    {isSelf && `${chat.sent_at ? ' . ' : ''}${getStatus(chat)}`}
                  </div>
                )}
              </div>
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
                <div
                  key={chat.localId}
                  className={cn('flex flex-col space-y-1 p-2 items-end')}
                >
                  <div
                    className={cn(
                      'flex flex-col w-auto p-2 rounded-tr-xl rounded-tl-xl rounded-bl-xl bg-green-200'
                    )}
                  >
                    <div className="text-sm font-bold">You</div>
                    <div className="text-sm">{chat.body}</div>
                  </div>
                  <div className="text-xs">
                    {chat.isSending ? 'Sending...' : 'Failed'}
                  </div>
                </div>
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
          className="w-full outline-none"
          placeholder="Tulis Pesan Anda"
          value={chat}
          onChange={(e) => {
            setChat(e.target.value)

            if (
              conversation &&
              (!typingAt ||
                moment.duration(moment().diff(moment(typingAt))).asSeconds() >=
                  5)
            ) {
              setTypingAt(new Date())
              startTyping(conversation.uid)
            }
          }}
        />
        <button
          className="cursor-pointer"
          disabled={!chat || chat.length === 0}
          onClick={() => {
            if (conversation) {
              sendMessage(conversation.uid, chat)
            } else {
              newConversation().then(({ data }: any) =>
                sendMessage(data.uid, chat)
              )
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
