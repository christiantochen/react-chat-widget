import cn from 'clsx'
import moment from 'moment'
import { FC } from 'react'

type ChatBodyProps = {
  isSelf: boolean
  groupWithNext?: boolean
  groupWithPrevious?: boolean
  isSending?: boolean
  events?: Array<any>
  // chat props
  body: any
  sent_at?: Date
  status?: string
}

const ChatBody: FC<ChatBodyProps> = ({
  isSelf,
  groupWithPrevious,
  groupWithNext,
  isSending,
  events,
  // chat props
  body,
  sent_at,
  status = 'pending',
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1 px-2', {
        'items-end': isSelf,
        'items-start': !isSelf,
        'mb-2': !groupWithNext,
        'mb-0.5': groupWithNext,
      })}
    >
      {events &&
        events.map((event) => (
          <div
            key={event.id}
            className={cn('text-xs self-center', {
              block: event.type === 'event',
              'bg-slate-200 rounded p-1': event.type !== 'event',
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
          'rounded-br-xl': !isSelf && !groupWithNext,
        })}
        style={{ maxWidth: '75%' }}
      >
        {!groupWithPrevious && (
          <div className="text-sm font-bold">{isSelf ? 'You' : 'Agent'}</div>
        )}
        <div className="text-sm break-words">{body}</div>
      </div>

      {!groupWithNext && (
        <div className="text-xs">
          {sent_at ? (
            <>
              {moment(sent_at).format('HH:mm')}
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
