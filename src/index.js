import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Hỗ trợ cấu hình URL Backend động cho CodeSandbox (tách biệt FE và BE)
const originalFetch = window.fetch;
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    const newInit = { ...init };
    // Bật credentials để truyền cookie session trong mọi trường hợp (cả localhost và cross-origin)
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
