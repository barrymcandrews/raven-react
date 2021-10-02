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
      <Link className="navbar-title" to="/"><div>RAVEN MESSENGER</div></Link>

			<div className="navbar-content">
				<NavLink exact activeClassName="selected" to="/"><button>Home</button></NavLink>
				<NavLink activeClassName="selected" to="/rooms"><button>Rooms</button></NavLink>
				{/*<NavLink activeClassName="selected" to="/about"><button>About</button></NavLink>*/}
				<div className="navbar-placeholder"/>
        <div className="navbar-item" children={navbarRight}/>
			</div>
		</div>
	);
}
