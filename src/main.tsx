import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css'
import AppRoutes from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/pollyglot">
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
