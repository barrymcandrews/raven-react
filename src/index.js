import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Router from './components/Router';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';

  Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_5Pjtpk3Ui',
    userPoolWebClientId: '6thapshl22b441iojmq6onsh6j',
    region: 'us-east-1',
  },
    API: {
      endpoints: [
        {
          name: "RavenApi",
          endpoint: "https://5qujftckd4.execute-api.us-east-1.amazonaws.com/prod/"
        },
      ]
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
