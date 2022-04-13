import './assets/main.css'
import './assets/chrome-bug.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Find all widget divs
const WidgetDivs = document.querySelectorAll('.react-chat-widget')

// Inject our React App into each
WidgetDivs.forEach((div) => {
  ReactDOM.render(
    <React.StrictMode>
      <App element={div} />
    </React.StrictMode>,
    div
  )
})
