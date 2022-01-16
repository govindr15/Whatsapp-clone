
import React from"react";
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { useStateValue } from './StateProvider';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import GroupInfo from "./GroupInfo";

function App() {                                                                                                                                                                                         
  const [{user},dispatch]=useStateValue();                   

  return (
    // BEM naming convention
    <div className="app">
      {!user ?(<Login />):(
      <div className="app__body">
        <Router>   
          <Sidebar />
          <Switch>
            <Route exact path="/">
              <Chat />
            </Route>
            <Route exact path="/rooms/:roomId">
              <Chat />
            </Route>
            <Route exact path="/rooms/:roomId/groupInfo">
              <Chat />
              <GroupInfo />
            </Route>
          </Switch>
        </Router>
      </div>
    )}
    </div>
  );
}

export default App;
