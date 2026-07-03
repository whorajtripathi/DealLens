// main.jsx — The absolute starting point of your React app
// React mounts your entire app into the <div id="root"> in index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter enables navigation between pages */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
// Note: If you want to use React Router's "HashRouter" instead of "BrowserRouter", you can replace it here. HashRouter is useful for static file hosting where the server doesn't handle dynamic routes. 