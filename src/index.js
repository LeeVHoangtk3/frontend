import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const originalFetch = window.fetch;
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    const newInit = { ...init };
    
    newInit.credentials = 'include';
    return originalFetch(baseUrl + input, newInit);
  }
  return originalFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




reportWebVitals();
