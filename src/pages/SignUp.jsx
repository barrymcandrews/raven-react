import React, {useState} from 'react';
import {Auth, Hub} from 'aws-amplify'
import {
  useHistory,
  useLocation
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
  const [messsage, setMessage] = useState('');

  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  function createNewAccount() {
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

  return (
    <div id="login-cont" className="vertical-center-container">
      <div className="centered vertical-center horizontal-center-sm">
        <div className="text-md">Sign Up</div>
        <div id="msg-label" className="text-sm error">{messsage}</div>
        <div>
          <div className="row">
            <span className="text-sm">Username:</span>
            <input type="text" onChange={(event) => setUsername(event.target.value)}/>
          </div>
          <div className="row">
            <span className="text-sm">Email:</span>
            <input type="text" onChange={(event) => setEmail(event.target.value)}/>
          </div>
          <div className="row">
            <span className="text-sm">Password:</span>
            <input type="password" onChange={(event) => setPassword(event.target.value)}/>
          </div>
          <button onClick={createNewAccount}>Create New Account</button>
          <div className="text-sm">Already have an account? <Link to="/login">Log In</Link></div>
        </div>
      </div>
    </div>
  );
}


