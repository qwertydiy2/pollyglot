import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import AppRoutes from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/pollyglot">
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
