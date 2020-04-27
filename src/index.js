import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Router from './components/Router';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import {AppContextProvider} from "./components/AppContext";
import {ModalProvider} from "react-modal-hook";
import Modal from 'react-modal';

Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    region: 'us-east-1',
  },
    API: {
      endpoints: [
        {
          name: "RavenApi",
          endpoint: process.env.REACT_APP_REST_ENDPOINT,
        },
      ]
    }
});

Modal.setAppElement('#root');
ReactDOM.render(
	<React.StrictMode>
    <AppContextProvider>
      <ModalProvider>
        <Router />
      </ModalProvider>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
