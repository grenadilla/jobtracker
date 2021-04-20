import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="cs411-jobtracker.us.auth0.com"
      clientId="LUSkB27Ygy76poE786XZ91fCBkm4SdT6"
      redirectUri={window.location.origin}
      onRedirectCallback={({ redirectUrl }) => window.location.assign(redirectUrl || '/')}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
