import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useAuthStore } from './store/useAuthStore';
import './index.css';
import App from './App.jsx';

useAuthStore.getState().hydrate();

const root = document.getElementById('root');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
