import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Routes from './routes';
import MainStore from './stores/MainStore';
import './styles/index.css';

const theme = createMuiTheme();

@observer
class App extends Component {

    componentDidMount() {
        if(localStorage.getItem('access_token')) MainStore.test();
    };

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Routes />
            </MuiThemeProvider>
        );
    }
}

export default App;