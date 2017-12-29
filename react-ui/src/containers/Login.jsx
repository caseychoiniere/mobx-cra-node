import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

@observer
class Login extends Component {

    componentDidMount() {
        MainStore.getAuthProviders();
    }

    componentDidUpdate() {
        const { appConfig } = MainStore;
        let accessToken, url;
        if (!appConfig.apiToken) {
            url = window.location.hash.split('&');
            accessToken = url[0].split('=')[1];
            if(accessToken && appConfig.serviceId !== null) MainStore.getApiToken(accessToken);
        }
    }

    createLoginUrl = () => {
        const {appConfig} = MainStore;
        return `${appConfig.authServiceUri}&state=${appConfig.serviceId}&redirect_uri=${window.location.href}`
    };

    initiateLogin = () => {
        MainStore.toggleLoading()
    };

    render() {
        const {loading} = MainStore;
        return (
            <div>
                {!loading ? <a href={this.createLoginUrl()} onClick={this.initiateLogin}>
                    <RaisedButton label="Login" primary={true} />
                </a> : <CircularProgress size={70} thickness={5} />}
            </div>
        );
    }
}

export default Login;
