import { config } from './config';
import { getFetchParams } from './util/fetchUtil';

const api = {

    test: () => {
        return fetch(`${config.APP_URL}api/status`, getFetchParams('get', 'Bearer ' +localStorage.getItem('access_token')))
    },

    getDDSApiToken: () => {
        return fetch(`${config.APP_URL}api/agent-token`, getFetchParams('get', 'Bearer ' +localStorage.getItem('access_token')))
    },

    getProjects: (token) => {
        return fetch(`${config.DDS_API_URL}/projects?per_page=1000`,getFetchParams('get', token))
    },

    makePlanet: () => {
        let body = {
            "name": "cyclops782348792",
            "rotation_period": 25,
            "orbital_period": 700,
            "diameter": 7000,
            "population": 9000
        };
        return fetch(`https://morning-dusk-94993.herokuapp.com/api/planets`, getFetchParams('post', 'Bearer ' +localStorage.getItem('access_token'), body))
    },

    postUserSession: (profile) => {
        // const body = {
        //     "name": profile.name,
        //     "email": profile.email,
        //     "login_time": new Date().getTime(),
        // };
        // return fetch(`https://morning-dusk-94993.herokuapp.com/api/usersessions`, getFetchParams('post', 'Bearer ' +localStorage.getItem('access_token'), body))
    }
};

export default api;