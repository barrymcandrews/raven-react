import {IncomingOptions} from 'use-http/dist';
import {Provider} from "use-http";
import Auth from '@aws-amplify/auth';
import React from 'react';

export function HttpProvider({children}: any) {
  const options: IncomingOptions = {
    interceptors: {
      request: async ({ options }) => {
        options.headers = {
          Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
        }
        return options
      }
    }
  };

  return (
    <Provider url={process.env.REACT_APP_REST_ENDPOINT + '/v1'} options={options}>
      {children}
    </Provider>
  );
}
