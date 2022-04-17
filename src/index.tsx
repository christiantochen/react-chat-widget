export * from './api'
export * from './components'

import './assets/main.css'
import './assets/chrome-bug.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ChatProvider, VisitorProvider } from './context'
import { setConfig } from './config'
import { ChatWidget } from './components'

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
