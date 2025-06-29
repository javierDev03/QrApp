// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import QrScanner from 'qr-scanner';
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error('❌ No se encontró el div con id="root" en el HTML.');
}