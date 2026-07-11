import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import App from './App.jsx'
import { applyAutomaticTheme } from '../shared/themes/liturgicalThemes.js'

// Cargar el tema litúrgico automáticamente basado en la fecha actual
applyAutomaticTheme()

// Revisar cada hora si cambió la temporada litúrgica y reaplicar el tema
setInterval(() => {
  applyAutomaticTheme()
}, 1000 * 60 * 60) // cada 1 hora

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
