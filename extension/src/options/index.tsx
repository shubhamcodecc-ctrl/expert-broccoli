import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { OptionsPage } from '../components/OptionsPage';
import '../styles/options.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
