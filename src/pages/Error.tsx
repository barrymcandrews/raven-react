import React from 'react';
import {Link} from 'react-router-dom';


function Error() {
  return (
    <div className="flex-grow-0 flex">
      <div className="flex-row">
        <div className="w-375 flex-col">
          <div className="main-content flex-grow-1">
            <div className="flex-col  h-100 text-center">
              <h2>Page not found.</h2>
              <div className="welcome-button-group">
                <div className="flex-row">
                  <Link to="/" className="welcome-button"><button>Go Home</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
