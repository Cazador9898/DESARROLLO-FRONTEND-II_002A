import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext.jsx';
import App from './App.jsx';
import './styles/index.css';
import './styles/tailwind.css';

// En GitHub Pages, HashRouter permite abrir rutas internas sin errores 404.
// En desarrollo local se conserva BrowserRouter como en las semanas anteriores.
const Router = import.meta.env.VITE_GITHUB_PAGES === 'true' ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </Router>
  </React.StrictMode>
);
