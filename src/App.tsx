import cn from 'clsx'
import { useState } from 'react'
import { ChatProvider } from './context/chat'
import ChatView from './chatView'
import { VisitorProvider } from './context'

function App({ element }: { element: Element }) {
  const token = element.getAttribute('data-token')
  const [isOpen, setIsOpen] = useState<Boolean | undefined>()

  return (
    <VisitorProvider>
      <ChatProvider
        token={
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyMzIsInVzZXJuYW1lIjo4Mjk0OTkyOTQzOTMwNCwiZXhwIjoxNjQ5ODI5NjY1LCJlbWFpbCI6ImNocmlzdGlhbnRvQGdvYXBwLmNvLmlkIiwidWlkIjo4Mjk0OTkyOTQzOTMwNCwib3JpZ19pYXQiOjE2NDk4MjkzNjV9.BpMxl72Y5s6XyrwVPZlVRQ_myBsKdITRnLPmzDOw1W8'
        }
        business_id={62124827269192}
      >
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
            {isOpen ? 'Close' : 'Open'}
          </div>
        </div>
      </ChatProvider>
    </VisitorProvider>
  )
}

export default App
