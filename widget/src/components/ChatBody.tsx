import cn from 'clsx'
import moment from 'moment'
import React from 'react'

type ChatBodyProps = {
  isSelf: boolean
  groupWithNext?: boolean
  groupWithPrevious?: boolean
  isSending?: boolean
  events?: Array<any>
  // chat props
  body: any
  sentAt?: Date
  status?: string
}

const ChatBody: React.FC<ChatBodyProps> = ({
  isSelf,
  groupWithPrevious,
  groupWithNext,
  isSending,
  events,
  // chat props
  body,
  sentAt,
  status = 'pending'
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1 px-2', {
        'items-end': isSelf,
        'items-start': !isSelf,
        'mb-2': !groupWithNext,
        'mb-0.5': groupWithNext
      })}
    >
      {events &&
        events.map((event) => (
          <div
            key={event.id}
            className={cn('text-xs self-center', {
              block: event.type === 'event',
              'bg-slate-200 rounded p-1': event.type !== 'event'
            })}
          >
            {event.text}
          </div>
        ))}
      <div
        className={cn('flex flex-col p-2', {
          'bg-emerald-200': isSelf,
          'bg-slate-200': !isSelf,
          'rounded-tr-xl rounded-tl-xl': !groupWithPrevious,
          'rounded-bl-xl': isSelf && !groupWithNext,
          'rounded-br-xl': !isSelf && !groupWithNext
        })}
        style={{ maxWidth: '75%' }}
      >
        {!groupWithPrevious && (
          <div className='text-sm font-bold'>{isSelf ? 'You' : 'Agent'}</div>
        )}
        <div className='text-sm break-words'>{body}</div>
      </div>

      {!groupWithNext && (
        <div className='text-xs'>
          {sentAt ? (
            <>
              {moment(sentAt).format('HH:mm')}
              {isSelf && ` . ${status}`}
            </>
          ) : (
            <>{isSending ? 'Sending...' : 'Failed'}</>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatBody
