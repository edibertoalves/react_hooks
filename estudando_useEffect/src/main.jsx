import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode ajuda a identificar problemas potenciais no código, como efeitos colaterais inesperados.
  // Ele executa o código duas vezes em desenvolvimento para detectar problemas, mas não afeta o comportamento em produção.
  <StrictMode>
    <App />
  </StrictMode>,

)
