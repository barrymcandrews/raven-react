import React, {useState} from 'react';
import {Auth} from 'aws-amplify'
import {
  useHistory
} from "react-router-dom";
import {Link} from 'react-router-dom';


const errorMap = {
  UserNotConfirmedException: 'User is not confirmed.',
  PasswordResetRequiredException: 'Password must be reset before login.',
  NotAuthorizedException: 'Username or password incorrect.',
  UserNotFoundException: 'Username or password incorrect.',
  InvalidPasswordException: 'Password not strong enough.',
  UsernameExistsException: 'A user with that username already exists.',
  AuthError: 'Username can not be empty.',
};

export default function SignUp({signIn}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messsage, setMessage] = useState('');

  let history = useHistory();

  function createNewAccount() {
    if (confirmPassword !== password) {
      setMessage('Passwords do not match.');
      return;
    }

    Auth.signUp({
      username: username,
      password: password,
      attributes: {email: email}
    })
      .then((result) => {
        history.replace('/verify-user/' + username);
      })
      .catch((err) => {
        const message = (err.code in errorMap) ? errorMap[err.code] : 'An unknown error occurred.';
        setMessage(message);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    createNewAccount();
  }

  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex">
      <div className="w-375 flex-col">
        <div className="main-content">
          <div className="text-center text-md">Sign Up</div>
          <p className="text-center msg-label text-sm error">{messsage}</p>

          <div className="input-label text-sm">Username:</div>
          <div className="flex-row">
            <input type="text" autoComplete="username" onChange={(event) => setUsername(event.target.value)}/>
          </div>

          <div className="input-label text-sm">Email:</div>
          <div className="flex-row">
            <input type="text" autoComplete="email" onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div className="input-label text-sm">Password:</div>
          <div className="flex-row">
            <input type="password" autoComplete="new-password" onChange={(event) => setPassword(event.target.value)}/>
          </div>

          <div className="input-label text-sm">Confirm Password:</div>
          <div className="flex-row">
            <input type="password" autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)}/>
          </div>

          <div className="flex-row">
            <button className="login-button" onClick={createNewAccount}>Create New Account</button>
          </div>
          <div className="m-5 text-center text-sm">Already have an account? <Link to="/login">Log In</Link></div>
        </div>
      </div>
    </form>
  );
}


