import React, { Component } from 'react';
import './Home.css';

class Home extends Component {    
  render() {
    if(!this.props.isAuth){
      return (
        <div className="container">
          <h2>NJIT Tennis Overlay</h2>
          <p className="text-secondary">Only those with njit.edu emails are able to use this tool</p>
          <button onClick={this.props.signInWithGoogle} className="btn btn-primary col-12">NJIT Login</button>
          <p className="mt-5">
            Need Help?<br/>
            <span className="text-secondary">            
            If the login is automatically using your default Google account, try adding your NJIT account manually 
            <a href="https://accounts.google.com/AddSession"> here</a>.<br />Then come back and try logging in again above.
            </span>
          </p>
        </div>
      )
    }else{
      return (
        <div className="container">
          <h2>NJIT Tennis Overlay</h2>
          <p className="text-success">Email Authenticated!</p>
          <p className="text-secondary">
          <span className="text-white">Quick Start</span>
          <br /><br />
          <i className="fas fa-cog mr-1"></i>Settings
          <br />- Start / end your live stream
          <br />- Set up your team names and player names
          <br />- Switch between courts, match types and set counts
          <br /><br />
          <i className="fas fa-gamepad mr-1"></i>Controller
          <br />- Keep track of scores and update them in realtime
          <br />- Advanced settings available for manual score setting and score reset
          </p>
          <button onClick={this.props.signOut} className="btn btn-secondary col-12">Logout</button>
        </div>
      )
    }
  }
}

export default Home;