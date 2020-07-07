import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateUser from './components/CreateUser';

const Routes = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/create" component={CreateUser}/>
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;