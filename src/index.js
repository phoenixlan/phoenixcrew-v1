import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { init } from '@phoenixlan/phoenix.js';

import App from './App';
import reportWebVitals from './reportWebVitals';

import * as Sentry from "@sentry/react";

export const BASE_URL = process.env.REACT_APP_API_URL??"http://api.dev.phoenixlan.no:3000";

const initialize = () => {
    init(BASE_URL); //init(process.env.BASE_URL);
    if(process.env.REACT_APP_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
      });
    }
};

initialize()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
