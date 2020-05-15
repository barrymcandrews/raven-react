import React, {FormEvent, useState} from 'react';
import {Auth, Hub} from 'aws-amplify'
import {
  Link, Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

type ErrorMap = {[key: string]: string };
const errorMap: ErrorMap = {
  UserNotConfirmedException: 'User is not confirmed.',
  PasswordResetRequiredException: 'Password must be reset before login.',
  NotAuthorizedException: 'Username or password incorrect.',
  UserNotFoundException: 'Username or password incorrect.',
  InvalidPasswordException: 'Password not strong enough.',
  UsernameExistsException: 'A user with that username already exists.',
  AuthError: 'Username can not be empty.',
};

export default function Login({authState}: {authState: string}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messsage, setMessage] = useState('');

  let history = useHistory();
  let location = useLocation();
  let { from }: any = location.state || { from: { pathname: "/" } };

  function logIn() {
    Auth.signIn(username, password)
      .then((user) => {
        Hub.dispatch('auth', { event: 'cognitoHostedUI', data: user }, 'Auth');
        history.replace(from);
      })
      .catch((err) => {
        if (err.code === 'UserNotConfirmedException') history.replace('/verify-user/' + username);
        const message = (err.code in errorMap) ? errorMap[err.code] : 'An unknown error occurred.';
        setMessage(message);
      });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logIn();
  }

  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex">
      {authState === 'signedIn' && <Redirect to="/"/>}
      <div className="w-375 flex-col">
        <div className="main-content">
          <div className="text-center text-md">Log In</div>
          <p className="text-center msg-label text-sm error">{messsage}</p>

          <div className="input-label text-sm">Username:</div>
          <div className="flex-row">
            <input type="text" autoCapitalize="off" autoComplete="username" onChange={(event) => setUsername(event.target.value)}/>
          </div>

          <div className="input-label text-sm">Password:</div>
          <div className="flex-row">
            <input type="password" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)}/>
          </div>

          <div className="flex-row">
            <button className="login-button" onClick={() => logIn()}>Log In</button>
          </div>
          <div className="m-5 text-center text-sm">Don't have an account? <Link to="/signup">Create one!</Link></div>

        </div>
      </div>
    </form>
  );
}


