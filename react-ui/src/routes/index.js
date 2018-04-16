import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import appConfig from '../appConfig';
import AuthStore from '../stores/AuthStore';
import { Container } from 'react-grid-system';
import Graph from '../containers/Graph.jsx';
import Header from '../components/Header';
import Home from '../containers/Home.jsx';
import LeftNav from '../components/LeftNav.jsx';
import Login from '../containers/Login.jsx';

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        AuthStore.handleAuthentication();
    }
};

const PrivateRoute = ({ component: Component, ...rest }) => {
    !appConfig.apiToken && window.sessionStorage.setItem('redirectUrl', window.location.pathname);
    return <Route {...rest} render={(props) =>
        AuthStore.isAuthenticated() ? (
            <Component {...props}/>
        ) : (
            <Redirect to="/login"/>
        )
    }/>
};

const LoginRoute = ({ component: Component, ...rest }) => {
    const redirectUrl = window.sessionStorage.getItem('redirectUrl') ? window.sessionStorage.getItem('redirectUrl') : '/';
    return <Route {...rest} render={(props) => {
        handleAuthentication(props);
        return !AuthStore.isAuthenticated() ? <Component {...props} /> : <Redirect to={redirectUrl}/>
    }}/>
};

export default () => (
    <Router>
        <div>
            <Route component={Header} />
            {AuthStore.isAuthenticated() && <Route component={LeftNav} />}
            <Container fluid className="mainContainer">
                <Switch>
                    <LoginRoute path='/login' component={Login} />
                    {/*<Route path="/login" render={(props) => {*/}
                        {/*handleAuthentication(props);*/}
                        {/*return !AuthStore.isAuthenticated() ? <Login {...props} /> : <Redirect to="/" />*/}
                    {/*}}/>*/}
                    <PrivateRoute exact path="/" component={Home} />
                    <Redirect to="/" />
                </Switch>
            </Container>
        </div>
    </Router>
);