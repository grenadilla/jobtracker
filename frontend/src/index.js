import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";

import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="cs411-jobtracker.us.auth0.com"
      clientId="LUSkB27Ygy76poE786XZ91fCBkm4SdT6"
      redirectUri={window.location.origin}
      onRedirectCallback={({ redirectUrl }) => window.location.assign(redirectUrl || '/')}
      audience="cs411-jobtracker-api"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
