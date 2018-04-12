import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import MainStore from '../stores/MainStore';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

@observer
class Login extends Component {

    login = () => {
        MainStore.toggleLoading();
        AuthStore.login();
    };

    render() {
        const {loading} = MainStore;
        return (
            <div>
                {
                    !loading ?
                    <RaisedButton label="Login" primary={true} onClick={this.login} />
                    : <CircularProgress size={70} thickness={5} />
                }
            </div>
        );
    }
}

export default Login;
