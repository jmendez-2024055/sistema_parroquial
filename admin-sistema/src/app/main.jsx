import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import App from './App.jsx'
import { loadSavedTheme } from '../shared/themes/liturgicalThemes.js'

// Cargar el tema litúrgico guardado al iniciar la aplicación
loadSavedTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
