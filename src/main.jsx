import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { CalendarProvider } from './context/CalendarContext.jsx';
import App from './App.jsx';
import './styles/global.css';
import './styles/design-system.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CalendarProvider>
        <App />
      </CalendarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

