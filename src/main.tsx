import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/patient-dark-theme.css';
import './styles/light-purple-theme.css';
import './styles/unified-colors.css';
import './styles/responsive-fixes.css';
import './styles/compact-ui.css';
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
