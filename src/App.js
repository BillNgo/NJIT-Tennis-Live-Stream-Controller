import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from './Main'
import Overlay from './Overlay'

class App extends Component {

    render() {
        return (
            <Router>                    
                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route path='/overlay/:id' component={Overlay} />
                </Switch>
            </Router>
        )
    }
}

export default App;
