import React from 'react';
import {Link} from 'react-router-dom';

export default function Home({authState}: {authState: string}) {
  const signedIn = (authState === 'signedIn');
  return (
		<div className="flex-grow-0 flex">
      <div className="flex-row">
        {/* Center Content */}
        <div className="w-375 flex-col">
          <div className="main-content flex-grow-1">
            <div className="flex-col  h-100 text-center">
              <h2>Welcome to Raven Messenger</h2>
              <p>Raven is the retro chat app for 2020.</p>

              <div className="flex-row">
                <img className="small-content" height={100} width={100} src="/static/img/raven-glitched.png" alt="raven.png"/>
              </div>

              {/*<div className="flex-col flex-center flex-grow-1">*/}
              {/*  <p>With Raven Messenger you can:</p>*/}
              {/*  <div className="small-content"><h4>chat with strangers online</h4></div>*/}
              {/*  <div className="small-content"><h4>make new friends (or enemies)</h4></div>*/}
              {/*  <div className="small-content"><h4>stay young forever</h4></div>*/}
              {/*</div>*/}

              {/*<div className="flex-grow-1"></div>*/}

              <div className="welcome-button-group">
                <div className="flex-row">
                  <Link to="/rooms" className="welcome-button"><button>
                    {signedIn ? 'Start Chatting' : 'Log In'}
                  </button></Link>
                </div>

                {!signedIn &&
                  <div className="flex-row">
                    <Link to="/signup" className="welcome-button"><button>Sign Up</button></Link>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	);
}
