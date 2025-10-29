import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { CalendarProvider } from './context/CalendarContext.jsx';
import { AudioProvider } from './context/AudioContext.jsx';
import App from './App.jsx';
import './styles/global.css';
import './styles/design-system.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <CalendarProvider>
            <App />
          </CalendarProvider>
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

