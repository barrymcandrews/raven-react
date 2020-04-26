import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Auth} from "aws-amplify";

export default function Home() {
  // useEffect(() => {document.title = 'Home - Raven Messenger'});
  const [jwt, setJwt] = useState('');

  Auth.currentSession()
    .then(session => {
      setJwt(session.getAccessToken().getJwtToken());
    }).catch(e => setJwt(''));

  return (
		<div className="horizontal-center-md">
      <div className="main-content">
        <h3>Welcome to Raven Messenger</h3>
        <p><i>This demo is not yet finished! Come back soon. I'm almost done.</i></p>
        <p>You can use this site to chat with strangers across the world wide web.
          Click <Link to="/rooms">here</Link> to go to the chat rooms.</p>
      </div>
      {process.env.NODE_ENV !== 'production' &&
        <div className="main-content">
          <p>{jwt}</p>
        </div>
      }
		</div>
	);
}
