import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';   // ← Redux Provider
import { store } from './store';          // ← notre store

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>   {/* ← entoure toute l'app */}
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
