import cn from 'clsx'
import { useState } from 'react'
import { MdClose, MdOutlineChat } from 'react-icons/md'
import { ChatProvider } from './context/chat'
import ChatView from './components/chatView'
import { VisitorProvider } from './context'
import { setConfig } from './config'

function App({ element }: { element: Element }) {
  const [isOpen, setIsOpen] = useState<Boolean | undefined>()

  setConfig(element.getAttribute('data-api-key'))

  return (
    <VisitorProvider>
      <ChatProvider>
        <div className={cn('fixed right-4 bottom-4 z-1000', 'flex flex-col')}>
          <ChatView
            className={cn({
              'animate-slidein': typeof isOpen !== 'undefined' && isOpen,
              'animate-slideout': typeof isOpen !== 'undefined' && !isOpen,
            })}
            style={{
              top: '100%',
              bottom: '-100%',
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
      </ChatProvider>
    </VisitorProvider>
  )
}

export default App
