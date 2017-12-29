import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

@observer
class Header extends Component {

    handleLogout = () => MainStore.handleLogout();

    toggleNav = () => MainStore.toggleNav();

    loggedIn = (props) => (
        MainStore.appConfig.apiToken ?
        <IconMenu
            {...props}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" onClick={this.handleLogout}/>
        </IconMenu> :
                <FlatButton {...this.props} href={this.createLoginUrl()} label="Login" onClick={this.initiateLogin}/>
    );

    createLoginUrl = () => {
        const {appConfig} = MainStore;
        return `${appConfig.authServiceUri}&state=${appConfig.serviceId}&redirect_uri=${window.location.href}`
    };

    initiateLogin = () => MainStore.toggleLoading();

    render() {
        const {appConfig} = MainStore;
        return (
            <AppBar
                iconStyleLeft={!appConfig.apiToken ? {display: 'none'} : {}}
                iconElementLeft={<IconButton><Menu onClick={this.toggleNav}/></IconButton>}
                iconElementRight={this.loggedIn()}
                style={{position: 'fixed'}}
            />
        );
    }
}

export default Header;