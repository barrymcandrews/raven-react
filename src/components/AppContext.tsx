import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import Auth from "@aws-amplify/auth";

export interface AppContextItems {
  idToken: string;
  username: string;
  accessToken: string;
  authState: string;
  setAuthState: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppContextItems>({
  idToken: '',
  username: '',
  accessToken: '',
  authState: '',
  setAuthState: (s: SetStateAction<string>) => {},
});

export function AppContextProvider(props: any) {
  const [username, setUsername] = useState<string>('');
  const [idToken, setIdToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [authState, setAuthState] = useState<string>('loading');

  useEffect(() => {
    Auth.currentUserInfo()
      .then(user => setUsername(user.username)
      ).catch(e => setUsername('')
    );
  }, [authState]);

  useEffect(() => {
    Auth.currentSession()
      .then(session => {
        setIdToken(session.getIdToken().getJwtToken());
        setAccessToken(session.getAccessToken().getJwtToken());
      }).catch(e => {
      setIdToken('');
      setAccessToken('');
    });
  }, [authState]);

  const context = {idToken, username, accessToken, authState, setAuthState};

  return (
    <AppContext.Provider value={context}>
      {props.children}
    </AppContext.Provider>
  );
}
