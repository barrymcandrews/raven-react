import React from 'react';
import {Link} from 'react-router-dom';

export default function About() {
  return (
		<div className="flex-grow-0 flex">
      <div className="flex-row">
        <div className="mw-700 flex-col">
          <div className="main-content flex-grow-1">
            <div className="flex-col  h-100 text-center">
              <h2>About Raven Messenger</h2>
              <p>Hello! And welcome to Raven Messenger.</p>
              <p className="text-left">
                This website is a was created
                by <a href="https://www.bmcandrews.com" target="_blank">Barry McAndrews</a> as
                a proof-of-concept to demonstrate the power of new cloud
                technologies. You may be surprised to find out that this website is completely
                serverless. <i>But how is that possible?</i> Well, this site is powered by AWS S3
                and AWS Lambda. To read more about how this site is
                built <a href="https://github.com/barrymcandrews/raven-iac" target="_blank">check out my GitHub page.</a>
              </p>

              <p className="text-left">
                Serverless web applications are going to dominate in the next 10 years for
                one reason alone: they're absurdly cheap. With AWS Lambda you pay for exactly
                what you use. No more and no less. For me, since nobody uses my websites, I pay
                close to nothing. For a company running a commercial website the bill wouldn't be
                nothing, but there would be substantial cost savings. This savings comes from the
                fact that companies no longer need to pay for idle servers. With Lambda you don't
                need extra servers laying around in case your site gets a spike of traffic. Scaling
                is handled automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
	);
}
