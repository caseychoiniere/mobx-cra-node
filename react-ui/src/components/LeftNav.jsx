import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import { Color } from '../theme/theme';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardBackspace } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    appBar: {
        height: 105,
        backgroundColor: Color.white
    },
    root: {
        height: 105
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        position: 'absolute',
        top: 8,
        left: 10,
    },
};

@observer
class LeftNav extends Component {

    toggleDrawer = (key) => MainStore.toggleDrawer(key);

    render() {
        const { classes } = this.props;
        const { drawers } = MainStore;
        return (
            <Drawer open={drawers.has('mainNavDrawer')}
                    onClose={() => this.toggleDrawer('mainNavDrawer')}
                    style={{position: 'relative'}}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={() => this.toggleDrawer('mainNavDrawer')}
                    onKeyDown={() => this.toggleDrawer('mainNavDrawer')}>
                    <AppBar position="static"
                            style={styles.appBar}
                            elevation={0}>
                        <IconButton className={classes.menuButton}
                                    color="inherit"
                                    aria-label="Menu"
                                    onClick={() => this.toggleDrawer('mainNavDrawer')}>
                            <KeyboardBackspace/>
                        </IconButton>
                    </AppBar>
                    <MenuItem style={{marginTop: 64}}>Menu Item</MenuItem>
                    <MenuItem >Menu Item 2</MenuItem>
                </div>
            </Drawer>
        );
    }
}

export default withStyles(styles)(LeftNav);