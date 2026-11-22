import './lib/themeInit';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
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
