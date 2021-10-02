import React, {useContext} from 'react';
import Navbar from './Navbar';
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect
} from 'react-router-dom';
import Chat from '../pages/Chat';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Rooms from '../pages/Rooms';
import {Authenticator} from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import Verify from "../pages/Verify";
import {AppContext} from "./AppContext";
import Error from '../pages/Error';
import About from '../pages/About';

function Router() {
  const {authState, setAuthState} = useContext(AppContext);

  return (
    <BrowserRouter>
        <Authenticator hideDefault={true} onStateChange={setAuthState}>
          <Navbar/>
          <Switch>
            <Route exact path="/" children={<Home authState={authState}/>}/>
            <Route exact path="/signup" children={<SignUp/>}/>
            <Route exact path="/verify-user/:username" children={<Verify/>}/>
            <Route exact path="/login" children={<Login authState={authState}/>}/>
            <Route exact path="/logout" children={<Logout/>}/>
            <Route exact path="/about" component={About}/>
            <PrivateRoute authState={authState} exact path="/rooms" children={<Rooms/>}/>
            <PrivateRoute authState={authState} exact path="/rooms/:roomName" children={<Chat/>}/>
            <Route path="*"><Error/></Route>
          </Switch>
        </Authenticator>
    </BrowserRouter>
  );
}

function PrivateRoute({children, authState, ...rest}: any) {
  return (
    <Route
      authState
      {...rest}
      render={({ location }) =>
        authState === 'signedIn' || authState === 'loading' ? (
          children
        ) : (
          <Redirect to={{
            pathname: "/login",
            state: { from: location }
          }}/>
        )
      }
    />
  );
}

function Logout() {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return (<Redirect to="/"/>);
}

export default Router;
