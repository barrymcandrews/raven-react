import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar({ authState, authData }) {
  const signedInItems = () => [
    <div key="nb-name" className="navbar-item">Hello, {authData.username}.</div>,
    <Link key="nb-logout" className="navbar-item" to="/logout">Log Out</Link>
  ];

  const signedOutItems = () => [
    <Link key="nb-login" className="navbar-item" to="/login">Log In</Link>
  ];

  const navbarRight = (authState === 'signedIn') ? signedInItems() : signedOutItems();
	return (
		<div className="navbar">
      <Link to="/"><div className="navbar-img"/></Link>

			<div className="navbar-content">
				<Link className="navbar-item" to="/">Home</Link>
				<Link className="navbar-item" to="/rooms">Rooms</Link>  {/* Removed selected page highlight */}
        <div className="navbar-item-right" >
          {navbarRight}
        </div>
			</div>
		</div>
	);
}
