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
  const [messsage, setMessage] = useState('');

  let history = useHistory();

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

  function onSubmit(e) {
    e.preventDefault();
    createNewAccount();
  }

  return (
    <form onSubmit={onSubmit} className="vertical-center-container">
      <div className="centered login-body main-content">
        <div className="text-md">Sign Up</div>
        <p className="msg-label text-sm error">{messsage}</p>
        <table>
          <tbody>
            <tr>
              <th><span className="text-sm">Username:</span></th>
              <td><input type="text" onChange={(event) => setUsername(event.target.value)}/></td>
            </tr>
            <tr>
              <th><span className="text-sm">Email:</span></th>
              <td><input type="text" onChange={(event) => setEmail(event.target.value)}/></td>
            </tr>
            <tr>
              <th><span className="text-sm">Password:</span></th>
              <td><input type="password" onChange={(event) => setPassword(event.target.value)}/></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button onClick={createNewAccount}>Create New Account</button>
                <div className="text-sm">Already have an account? <Link to="/login">Log In</Link></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}


