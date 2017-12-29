import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import MainStore from './stores/MainStore';
import './styles/index.css';

@observer
class App extends Component {

    componentDidMount() {
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