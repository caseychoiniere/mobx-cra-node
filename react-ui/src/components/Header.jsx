import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import MainStore from '../stores/MainStore'
import blue from 'material-ui/colors/blue';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { Menu as MenuIcon, MoreVert } from '@material-ui/icons'
import Menu, { MenuItem } from 'material-ui/Menu';

const styles = {
    appBar: {
        height: 150,
        backgroundColor: blue[300]
    },
    root: {
        height: 150
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

@observer
class Header extends Component {

    handleLogout = () => AuthStore.logout();

    initiateLogin = () => AuthStore.login();

    loggedIn = (props) => (
        AuthStore.isAuthenticated() ?
            <Menu
                id="simple-menu"
                anchorEl={MainStore.anchorElements.get('headerMenu')}
                open={MainStore.anchorElements.has('headerMenu')}
                onClose={(e) => this.openMenu(e, 'headerMenu')}
            >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu> : <Button variant="raised" color="secondary" onClick={this.initiateLogin}>
            Login
        </Button>
    );

    openMenu = (event, i) => {
        MainStore.setAnchorElement(event.currentTarget, i)
    };

    toggleDrawer = (key) => MainStore.toggleDrawer(key);

    render() {
        const { classes } = this.props;
        const open = MainStore.anchorElements.has('headerMenu');

        return (
            <div className={classes.root}>
                <AppBar position="static" style={styles.appBar}>
                    <Toolbar style={styles.menu}>
                        {AuthStore.isAuthenticated() && <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer('mainNavDrawer')}>
                            <MenuIcon />
                        </IconButton>}
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            CTTI LOGO here
                        </Typography>
                        {AuthStore.isAuthenticated() && <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={(e) => this.openMenu(e, 'headerMenu')}
                            color="inherit"
                        >
                            <MoreVert />
                        </IconButton>}
                        {this.loggedIn()}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Header);