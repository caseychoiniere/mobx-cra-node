import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import appConfig from '../appConfig';
import { Container } from 'react-grid-system';
import Graph from '../containers/Graph.jsx';
import Header from '../components/Header';
import Home from '../containers/Home.jsx';
import LeftNav from '../components/LeftNav.jsx';
import Login from '../containers/Login.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
    !appConfig.apiToken && window.sessionStorage.setItem('redirectUrl', window.location.pathname);
    return <Route {...rest} render={(props) =>
        !!appConfig.apiToken ? (
            <Component {...props}/>
        ) : (
            <Redirect to='/login'/>
        )
    }/>
};

const LoginRoute = ({ component: Component, ...rest }) => {
    const redirectUrl = window.sessionStorage.getItem('redirectUrl') ? window.sessionStorage.getItem('redirectUrl') : '/';
    return <Route {...rest} render={(props) => (
        !appConfig.apiToken ? <Component {...props} /> : <Redirect to={redirectUrl}/>
    )}/>
};

export default () => (
    <Router>
        <div>
            <Route component={Header} />
            {appConfig.apiToken && <Route component={LeftNav} />}
            <Container fluid className="mainContainer">
                <Switch>
                    <LoginRoute path='/login' component={Login} />
                    <PrivateRoute  path='/graph/:id' component={Graph} />
                    <PrivateRoute exact path='/' component={Home} />
                </Switch>
            </Container>
        </div>
    </Router>
);