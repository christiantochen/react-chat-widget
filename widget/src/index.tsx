import './assets/main.css'
import './assets/chrome-bug.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ChatProvider, VisitorProvider } from 'alpha-chat'
import { setConfig } from 'alpha-chat'
import { ChatWidget } from './components'
import Cookies from 'js-cookie'

const chatWidgetElement = document.querySelector('.alpha-chat-widget')

if (chatWidgetElement) {
  setConfig({
    apiKey: chatWidgetElement.getAttribute('data-api-key'),
    apiUrl: chatWidgetElement.getAttribute('data-api-url')
  })
  console.log(Cookies.get(), 'Cookies')
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
