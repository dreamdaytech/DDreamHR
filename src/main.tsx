import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './theme-overrides.css'

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Load theme preference before rendering the app.
const savedTheme = localStorage.getItem('theme');
const activeTheme = savedTheme === 'light' || savedTheme === 'dark'
  ? savedTheme
  : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(activeTheme);
document.documentElement.style.colorScheme = activeTheme;

createRoot(document.getElementById("root")!).render(<App />);
