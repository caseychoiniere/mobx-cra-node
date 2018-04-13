import { getFetchParams } from './util/fetchUtil';
import MainStore from './stores/MainStore'

// const DDS_BASE_URI = process.env.NODE_ENV === 'production' ? DDS_CLIENT_CONFIG.baseUrl : 'https://apidev.dataservice.duke.edu';
const DDS_BASE_URI = 'https://apidev.dataservice.duke.edu/api/v1/';

const path = Object.freeze({
    AUTH_PROVIDERS: `auth_providers/`,
    ACCESS_TOKEN: `/user/api_token?access_token=`
});

const api = {

    getPlanets: () => {
        return fetch(`https://morning-dusk-94993.herokuapp.com/api/planets`, getFetchParams('get', 'Bearer ' +localStorage.getItem('access_token')))
    },

    test: () => {
        return fetch('/api', getFetchParams('get'))
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
        const body = {
            "name": profile.name,
            "email": profile.email,
            "login_time": new Date().getTime(),
        };
        return fetch(`https://morning-dusk-94993.herokuapp.com/api/usersessions`, getFetchParams('post', 'Bearer ' +localStorage.getItem('access_token'), body))
    },

    getAuthProviders: () => {
        return fetch(`${DDS_BASE_URI}${path.AUTH_PROVIDERS}`, getFetchParams('get'))
    },
    // getApiToken: (accessToken, appConfig) => {
    //     return fetch(`${DDS_BASE_URI+path.ACCESS_TOKEN+accessToken}&authentication_service_id=${appConfig.serviceId}`, getFetchParams('get'))
    // },
};

export default api;