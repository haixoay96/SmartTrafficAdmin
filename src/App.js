import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from './layouts/Home'
import Admin from './layouts/Admin'
import Login from './layouts/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path='/' component={Home}/>
            <Route  path='/admin' component={Admin}/>
            <Route  path='/login' component={Login}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
