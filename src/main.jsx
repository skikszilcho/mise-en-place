import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth'
import { DARK_MODE_STORAGE_KEY } from './config/constants'
import './styles/index.css'
import App from './app/App.jsx'

// Apply dark mode preference before first render to prevent flash.
// Checks localStorage first, then falls back to OS preference.
const savedDark = localStorage.getItem(DARK_MODE_STORAGE_KEY)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (savedDark === 'true' || (savedDark === null && prefersDark)) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
