import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cyan700 } from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper';

@observer
class Footer extends Component {

    render() {
        return (
        <Paper rounded={false} zDepth={2} style={{width: '100%', backgroundColor:  cyan700, height: 100, position: 'fixed', bottom: 0, left: 0}}>

        </Paper>
        );
    }
}

export default Footer;