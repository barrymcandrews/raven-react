import React from 'react';
import {Link} from 'react-router-dom';

export default function Home() {
  // useEffect(() => {document.title = 'Home - Raven Messenger'});

	return (
		<div className="horizontal-center-md">
      <div className="main-content">
        <h3>Welcome to Raven Messenger</h3>
        <p><i>This demo is not yet finished! Come back soon. I'm almost done.</i></p>
        <p>You can use this site to chat with strangers across the world wide web.
          Click <Link to="/rooms">here</Link> to go to the chat rooms.</p>
      </div>
		</div>
	);
}
