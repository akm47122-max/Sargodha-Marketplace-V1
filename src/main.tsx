import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker for PWA if supported in browser environment
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SargodhaMart PWA Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker registration skipped:', err));
  });
}
