import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/auth-context'
import { ThemeProvider } from '@/components/theme-provider'

createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="system">
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)
