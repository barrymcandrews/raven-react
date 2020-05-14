# Raven Messenger Frontend
🏗 [AWS Infrastructure](https://github.com/barrymcandrews/raven-iac)

🚀 [Live Demo](https://raven.bmcandrews.com)
<table>
  <tr>
    <td colspan="2"><b>Demo Account</b></td>
  </tr>
  <tr>
    <td>Username</td>
    <td>demouser</td>
  </tr>
  <tr>
    <td>Password</td>
    <td>#Password1</td>
  </tr>
</table>


## About The Project
Raven Messenger is a fictional serverless chat application developed as an example. Powered by React, this web app connects to a REST API and a WebSocket API defined in the [infrastructure repository](https://github.com/barrymcandrews/raven-iac). 


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.


## Deployment
The master branch of this project is automatically built and deployed to S3. In S3, it's hosted as a static website and served to [raven.bmcandrews.com](raven.bmcandrews.com) through AWS CloudFront.

