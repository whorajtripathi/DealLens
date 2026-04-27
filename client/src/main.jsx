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