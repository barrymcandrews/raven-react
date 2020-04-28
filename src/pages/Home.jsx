import React from 'react';
import {Link} from 'react-router-dom';

export default function Home() {
  // useEffect(() => {document.title = 'Home - Raven Messenger'});
  // const [jwt, setJwt] = useState('');

  // Auth.currentSession()
  //   .then(session => {
  //     setJwt(session.getAccessToken().getJwtToken());
  //   }).catch(e => setJwt(''));

  return (
		<div className="flex">
      <div className="flex-row">

        {/* Left Sidebar */}
        <div className="hide-sm flex-col">
          <div className="w-200 flex-grow-1 legacy-box">
            <div className="list">
              <div className="list-header">
                <span>Currently Online</span>
              </div>

              <div className="scroll-container">
                <div className="list-placeholder">This feature has not yet been implemented.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="w-500 flex-col">
          <div className="main-content">
            <h3>Welcome to Raven Messenger</h3>
            <p><i>This demo is not yet finished! Come back soon. I'm almost done.</i></p>
            <p>You can use this site to chat with strangers across the world wide web.
              Click <Link to="/rooms">here</Link> to go to the chat rooms.</p>
          </div>

          {/*{process.env.NODE_ENV !== 'production' &&*/}
          {/*  <div className="main-content">*/}
          {/*    <h3>Development Information</h3>*/}
          {/*    <p>Access Token:</p>*/}
          {/*    <p className="token">{jwt}</p>*/}
          {/*  </div>*/}
          {/*}*/}

        </div>
      </div>
    </div>
	);
}
