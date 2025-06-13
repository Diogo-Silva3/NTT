import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import '@/i18n'; 

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-company-background text-company-foreground">
    <div className="p-8 rounded-lg shadow-xl">
      <p className="text-xl animate-pulse">Carregando...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <Router>
        <App />
      </Router>
    </Suspense>
  </React.StrictMode>
);