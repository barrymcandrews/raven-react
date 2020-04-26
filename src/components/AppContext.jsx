import React, {createContext, useEffect, useState} from "react";
import {Auth} from "aws-amplify";

export const AppContext = createContext({});

export function AppContextProvider(props) {
  const [username, setUsername] = useState('');
  const [idToken, setIdToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    Auth.currentUserInfo()
      .then(user => {
        setUsername(user ? user.username : '');
      });
  }, [authState]);

  useEffect(() => {
    Auth.currentSession()
      .then(session => {
        setIdToken(session.getIdToken().getJwtToken());
        setAccessToken(session.getAccessToken().getJwtToken());
      });
  }, [authState]);

  const context = {idToken, username, accessToken, authState, setAuthState};

  return (
    <AppContext.Provider value={context}>
      {props.children}
    </AppContext.Provider>
  );
}
