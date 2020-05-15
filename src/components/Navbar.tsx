import React from 'react';
import {Link, NavLink} from 'react-router-dom';

export default function Navbar({ authState, authData }: any) {
  const signedInItems = () => [
    <span key="nb-name" className="navbar-username">Hello, {authData.username}.</span>,
    <Link key="nb-logout" to="/logout">Log Out</Link>
  ];

  const signedOutItems = () => [
    <Link key="nb-login" to="/login">Log In</Link>
  ];

  const navbarRight = (authState === 'signedIn') ? signedInItems() : signedOutItems();
	return (
		<div className="navbar">
      <Link to="/"><div className="navbar-img"/></Link>

			<div className="navbar-content">
				<NavLink className="navbar-item" exact activeClassName="selected" to="/">Home</NavLink>
				<NavLink className="navbar-item" activeClassName="selected" to="/rooms">Rooms</NavLink>
				<div className="navbar-placeholder"/>
        <div className="navbar-item" children={navbarRight}/>
			</div>
		</div>
	);
}
