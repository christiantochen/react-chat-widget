import '../src/assets/main.css'
import '../src/assets/chrome-bug.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ChatProvider, VisitorProvider } from '../src/context'
import { setConfig } from '../src/config'
import { ChatWidget } from '../src/components'

const chatWidgetElement = document.querySelector('.react-chat-widget')

if (chatWidgetElement) {
  setConfig(chatWidgetElement.getAttribute('data-api-key'))
  ReactDOM.render(
    <React.StrictMode>
      <VisitorProvider>
        <ChatProvider>
          <ChatWidget />
        </ChatProvider>
      </VisitorProvider>
    </React.StrictMode>,
    chatWidgetElement
  )
}
