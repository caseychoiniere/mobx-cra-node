import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { MenuItem } from 'material-ui/Menu';
import { Menu } from '@material-ui/icons';

const styles = {
    appBar: {
        height: 150,
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
class LeftNav extends Component {

    toggleDrawer = (key) => MainStore.toggleDrawer(key);

    render() {
        const { drawers } = MainStore;
        return (
            <Drawer open={drawers.has('mainNavDrawer')} onClose={() => this.toggleDrawer('mainNavDrawer')}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={() => this.toggleDrawer('mainNavDrawer')}
                    onKeyDown={() => this.toggleDrawer('mainNavDrawer')}
                >
                    <AppBar>
                        <IconButton styles={styles.menuButton} color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer('mainNavDrawer')}>
                            <Menu />
                        </IconButton>
                    </AppBar>
                    <MenuItem style={{marginTop: 64}}>Menu Item</MenuItem>
                    <MenuItem >Menu Item 2</MenuItem>
                </div>
            </Drawer>
        );
    }
}

export default LeftNav;