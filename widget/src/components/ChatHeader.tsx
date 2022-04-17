import cn from 'clsx'
import React from 'react'

type ChatHeaderProps = {
  isConnected: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected }) => {
  return (
    <div
      className={cn(
        'flex flex-col p-4 space-y-1 bg-slate-600',
        'border-b border-b-solid border-b-slate-200',
        'rounded-t-lg'
      )}
    >
      <div className={cn('font-bold text-white')}>Agent</div>
      <div className='flex flex-row items-center space-x-2'>
        <div
          className={cn('rounded-full w-3 h-3', {
            'bg-rose-600': !isConnected,
            'bg-green-600': isConnected
          })}
        />
        <div className='text-xs text-white text-opacity-75'>
          {isConnected ? 'Connected' : 'Connecting'}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
