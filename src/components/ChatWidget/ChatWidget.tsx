import cn from 'clsx'
import React, { useState } from 'react'
import { MdClose, MdOutlineChat } from 'react-icons/md'
import ChatView from './ChatView'

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<Boolean | undefined>()

  return (
    <div className={cn('fixed right-4 bottom-4 z-1000', 'flex flex-col')}>
      <ChatView
        className={cn({
          'animate-slidein': typeof isOpen !== 'undefined' && isOpen,
          'animate-slideout': typeof isOpen !== 'undefined' && !isOpen
        })}
        style={{
          top: '100%',
          bottom: '-100%'
        }}
      />
      <div
        className={cn(
          'select-none self-end',
          'flex rounded-full justify-center items-center',
          'bg-slate-600 text-white drop-shadow-lg cursor-pointer',
          'w-16 h-16'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={24} /> : <MdOutlineChat size={24} />}
      </div>
    </div>
  )
}

export default ChatWidget
