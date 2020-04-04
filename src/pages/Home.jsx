import React from 'react';
import {Link} from 'react-router-dom';

export default function Home() {
	return (
		<div id="main-content" className="horizontal-center-md">
			<h3>Welcome to Raven Messenger</h3>
			<p>You can use this site to chat with strangers across the world wide web.
				Click <Link to="/rooms">here</Link> to go to the chat rooms.</p>
			<img src="/static/img/source.gif" alt="surf the web"/>
		</div>
	);
}
