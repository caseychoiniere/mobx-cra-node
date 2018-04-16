import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-grid-system';
import AuthStore from '../stores/AuthStore'
import MainStore from '../stores/MainStore'
import Paper from 'material-ui/Paper'

@observer
class Home extends Component {
    componentDidMount() {
        // MainStore.getPlanets();
        AuthStore.getProfile();
    }

    render() {
        let {userProfile} = AuthStore;
        return (
               <span>{userProfile && <img src={userProfile.picture} alt="profile" style={{maxWidth: 80}}/>}</span>
        );
    }
}
{/*<Row>*/}
    {/*{*/}
        {/*projects.map((p) => {*/}
            {/*return (*/}
                {/*<Col key={p.id} sm={4} >*/}
                    {/*<Paper>*/}
                        {/*<p style={{padding: 4}}>{p.name}</p>*/}
                        {/*<p style={{padding: 4}}>{p.description}</p>*/}
                    {/*</Paper>*/}
                {/*</Col>*/}
            {/*)*/}
        {/*})*/}
    {/*}*/}
    {/*<Col debug md={12} style={{height: 1000}}>*/}

    {/*</Col>*/}
    {/*<Col debug sm={4} style={{height: 1000}}>*/}
        {/*One of three columns*/}
    {/*</Col>*/}
    {/*<Col debug sm={4} style={{height: 1000}}>*/}
        {/*One of three columns*/}
    {/*</Col>*/}
    {/*<Col debug sm={4} style={{height: 1000}}>*/}
        {/*One of three columns*/}
    {/*</Col>*/}
{/*</Row>*/}
export default Home;