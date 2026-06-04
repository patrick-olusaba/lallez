import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide preloader once React has mounted
const preloader = document.getElementById('preloader');
if (preloader) {
  // Small delay so the first paint is absorbed
  setTimeout(() => {
    preloader.classList.add('fade-out');
    // Remove from DOM after the fade transition
    setTimeout(() => preloader.remove(), 600);
  }, 300);
}
