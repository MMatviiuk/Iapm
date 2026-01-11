import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/globals.css';
import './styles/responsive-fixes.css';
import { initializePWA } from './utils/pwaUtils';
import { initializeAutoSync } from './utils/offlineQueue';

// Initialize PWA features
initializePWA();
initializeAutoSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
