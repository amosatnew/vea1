import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

// Ensure dark mode is applied
document.documentElement.classList.add('dark');

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: 'hsl(240 10% 5%)',
          border: '1px solid hsl(141 73% 42%, 0.2)',
          color: 'white',
        }
      }}
    />
  </StrictMode>
);
