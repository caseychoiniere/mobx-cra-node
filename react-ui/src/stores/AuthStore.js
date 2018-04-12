import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../api';
import appConfig from '../appConfig';
import auth0 from 'auth0-js';
import { checkStatus } from '../util/fetchUtil';
import history from '../routes/history';
import MainStore from './MainStore';

export class AuthStore {
    @observable auth0;
    @observable authenticated;
    @observable userProfile;

    constructor() {
        this.api = api;
        this.auth0 = new auth0.WebAuth({
            clientID: 'HeZIUdDdXhTOvWxfzHUKFOZtKDI3v772',
            domain: 'securepoint.auth0.com',
            responseType: 'token id_token',
            audience: 'https://morning-dusk-94993.herokuapp.com',
            redirectUri: 'http://localhost:3000/login',
            scope: 'openid email profile'
        });
        this.authenticated = false;
        this.userProfile = null;
    }

    @action getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        console.log(accessToken)
        if (!accessToken) {
            throw new Error('No Access Token found');
        }
        return accessToken;
    }

    @action getProfile() {
        let accessToken = this.getAccessToken();
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                this.userProfile = profile;
                this.postUserSession(this.userProfile);
            }
            console.log(this.userProfile)
            // cb(err, profile);
        });
    }

    @action handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                // history.replace('/');
            } else if (err) {
                // history.replace('/login');
                window.location.assign('/login');
                console.log(err);
                MainStore.toggleLoading();
            }
        });
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }


    @action login() {
        this.auth0.authorize();
        // MainStore.toggleLoading();
    }

    @action logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        // history.replace('/login');
        window.location.assign('/login');
    }

    @action postUserSession(profile) {
        api.postUserSession(profile);
    }

    @action setSession(authResult) {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
        // history.replace('/');
        this.getProfile();
        window.location.assign('/');
        MainStore.toggleLoading();
    }




    @action toggleLoading() {
        this.loading = !this.loading;
    }

    @action handleErrors(error) {
        this.loading = false;
        if (error && error.response && error.response.status) {
            if (error.response.status === 401) {
                // window.location.href = window.location.protocol + '//' + window.location.host + '/login';
            }
        }
    }

}

const authStore = new AuthStore();

export default authStore;