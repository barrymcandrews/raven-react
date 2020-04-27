import React, {useState} from 'react';
import {Auth} from 'aws-amplify'
import {
  useHistory,
  useParams
} from "react-router-dom";


export default function Verify() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Enter the code you received in your confirmation email.');
  const [isConfirmed, setConfirmed] = useState(false);
  let { username } = useParams();
  let history = useHistory();

  function verify() {
   Auth.confirmSignUp(username, code)
     .then(() => {
       setConfirmed(true);
       setMessage('Your account has been confirmed. To continue return to the login page.')
     }).catch(e => {
       setMessage('An unknown error occurred.');
     });
  }

  function resendCode() {
    Auth.resendSignUp(username)
      .then(() => {
        setMessage('A new verification has been sent.');
      })
      .catch(() => {
        setMessage('An unknown error has occurred.');
      });
  }

  const content = (!isConfirmed) ? (
    <div>
      <div className="input-label text-sm">Code:</div>
      <div className="flex-row">
        <input type="text" autoComplete="one-time-code" onChange={(event) => setCode(event.target.value)}/>
      </div>
      <div className="flex-row">
        <button className="login-btn-sm" onClick={verify}>Verify</button>
        <button className="login-btn-sm" onClick={resendCode}>Resend Code</button>
      </div>
    </div>
  ) : (
    <div className="flex-row">
      <button className="login-btn-sm" onClick={() => {history.replace('/login')}}>Go to Login Page</button>
    </div>
  );

  function onSubmit(e) {
    e.preventDefault();
    verify();
  }

  return (
    <form onSubmit={onSubmit} autoComplete='on' className="flex">
      <div className="w-375 flex-col">
        <div className="main-content">
          <div className="text-center text-md">Verify</div>
          <p className="text-center text-sm">{message}</p>
          {content}
        </div>
      </div>
    </form>
  );
}


