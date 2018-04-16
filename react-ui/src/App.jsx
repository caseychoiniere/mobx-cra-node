import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import MainStore from './stores/MainStore';
import './styles/index.css';

@observer
class App extends Component {

    componentDidMount() {
        // MainStore.test();
        fetch('https://blooming-ridge-83489.herokuapp.com/api')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                this.setState({
                    message: json.message,
                    fetching: false
                });
            }).catch(e => {
            this.setState({
                message: `API call failed: ${e}`,
                fetching: false
            });
        })
        setInterval(() => MainStore.checkSessionTimeout(), 2000);
    };

    render() {
        return (
            <MuiThemeProvider >
                <Routes />
            </MuiThemeProvider>
        );
    }
}

export default App;