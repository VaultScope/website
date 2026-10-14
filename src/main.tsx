import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Auto-recover from stale Vite deployment chunks without requiring manual force-reload
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Importing a module script failed')
  ) {
    if (!sessionStorage.getItem('chunk_reload_triggered')) {
      sessionStorage.setItem('chunk_reload_triggered', '1');
      window.location.reload();
    }
  }
});

window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk_reload_triggered');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
