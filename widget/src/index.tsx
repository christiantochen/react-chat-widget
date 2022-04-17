import './assets/main.css'
import './assets/chrome-bug.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ChatProvider, VisitorProvider } from 'react-chat'
import { initConfig } from 'react-chat'
import { ChatWidget } from './components'

const chatWidgetElement = document.querySelector('.react-chat-widget')

if (chatWidgetElement) {
  initConfig({
    apiKey: chatWidgetElement.getAttribute('data-api-key'),
    apiUrl: chatWidgetElement.getAttribute('data-api-url')
  })
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
