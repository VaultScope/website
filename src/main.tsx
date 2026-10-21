import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clear one-time chunk reload guard once the application successfully loads
window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk_reload_triggered');
  sessionStorage.removeItem('chunk_reload_boundary');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
