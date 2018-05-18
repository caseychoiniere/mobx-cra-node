import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import MainStore from '../stores/MainStore';
import Button from '@material-ui/core/Button';


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
                        <Button variant="raised" color="secondary" onClick={this.login}>
                            Login
                        </Button>
                        : null
                }
            </div>
        );
        {/*<Button label="Login" primary={true} onClick={this.login} />*/}
    }
}

export default Login
