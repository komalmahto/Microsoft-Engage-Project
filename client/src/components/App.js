import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from '../checkAuth/auth';
import LoginPage from "./views/LogIn/Login";
import RegisterPage from "./views/Signup/Signup";
import ChatPage from './views/Chatting/Chatting';
import Meet from "./views/Meet";
import Video from "./views/Video";
import Container from "./views/Container";
import UsersOnline from './views/UsersOnline';
import Notes from "./Notes";

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <Switch>
        <Route exact path="/"          component={Auth(LoginPage, false)} />
        <Route exact path="/register"  component={Auth(RegisterPage, false)} />
        <Route exact path="/home"      component={Auth(Container,true)}/>
        <Route exact path="/chat"      component={Auth(ChatPage,true)} />
        <Route exact path="/meet"      component={Auth(Meet,true)} />
        <Route exact path="/meet/:url" component={Auth(Video,true)}/>
        <Route exact path="/users"     component={Auth(UsersOnline,true)}/>
        <Route exact path="/notes"     component={Auth(Notes,true)}/>

       </Switch>
    
  </Suspense>

  );
}
export default App;
