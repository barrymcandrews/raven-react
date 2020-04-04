import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Router from './components/Router';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_VkC1xW2gz',
    userPoolWebClientId: '4vc9u8rtpbn5qjos6uqf1iaj13',
    region: 'us-east-1',
  }
});

ReactDOM.render(
	<React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
