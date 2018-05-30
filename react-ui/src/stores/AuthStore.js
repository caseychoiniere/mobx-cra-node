import { observable, action } from 'mobx';
import api from '../api';
import auth0 from 'auth0-js';
import MainStore from './MainStore';
import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = process.env.NODE_ENV !== 'production' ? runtimeEnv() : process.env.NODE_ENV;
const redirectUri = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/login' : 'https://blooming-ridge-83489.herokuapp.com/login';
let clientID = !process.env.NODE_ENV ? env.REACT_APP_CLIENT_ID : process.env.REACT_APP_CLIENT_ID;
clientID = clientID || '';

export class AuthStore {
    @observable auth0;
    @observable userProfile;

    constructor() {
        this.api = api;
        this.auth0 = new auth0.WebAuth({
            clientID: clientID,
            domain: 'securepoint.auth0.com',
            responseType: 'token id_token',
            audience: 'https://blooming-ridge-83489.herokuapp.com/',
            redirectUri: redirectUri,
            scope: 'openid email profile',
            options: {
                rememberLastLogin: false
            }
        });
        this.userProfile = null;
    }

    @action getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('No Access Token found');
        }
        return accessToken;
    }

    @action getDDSApiToken() {
        api.getDDSApiToken()
            .then()
            .then(response => response.json())
            .then((json) => {
                api.getProjects(json.api_token)
                    .then()
                    .then(response => response.json())
                    .then((json) => {
                        console.log(json.results);
                    }).catch(ex =>MainStore.handleErrors(ex))
            }).catch((er) => {
                MainStore.handleErrors(er)
            })
    }

    @action getProfile() {
        const accessToken = this.getAccessToken();
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                this.userProfile = profile;
                this.postUserSession(this.userProfile);
            }
            console.log(err, profile);
        });
    }

    @action handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                window.location.assign('/login');
                MainStore.toggleLoading();
            }
        });
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    @action login() {
        this.auth0.authorize();
    }

    @action logout(er) {
        if(!er) localStorage.removeItem('redirectUrl');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        window.location.assign(`https://securepoint.auth0.com/v2/logout?returnTo=${redirectUri}`);
    }

    @action postUserSession(profile) {
        api.postUserSession(profile);
    }

    @action setSession(authResult) {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        const redirectUrl = localStorage.getItem('redirectUrl') ? localStorage.getItem('redirectUrl') : '/';
        window.location.assign(redirectUrl);
        MainStore.toggleLoading();
    }
}

const authStore = new AuthStore();

export default authStore;