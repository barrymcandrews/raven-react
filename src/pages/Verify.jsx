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
      <div className="row">
        <span className="text-sm">Code:</span>
        <input type="text" onChange={(event) => setCode(event.target.value)}/>
      </div>
      <button onClick={verify}>Verify</button>
      <button onClick={resendCode}>Resend Code</button>
    </div>
  ) : (
    <button onClick={() => {history.replace('/login')}}>Go to Login Page</button>
  );

  return (
    <div id="login-cont" className="vertical-center-container">
      <div className="centered vertical-center horizontal-center-sm">
        <div className="main-content">
          <div className="text-md">Verify</div>
          <p id="msg-label" className="text-sm">{message}</p>
          {content}
        </div>
      </div>
    </div>
  );
}


