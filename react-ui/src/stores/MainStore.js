import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../api';
import appConfig from '../appConfig';
import { checkStatus } from '../util/fetchUtil';

export class MainStore {
    @observable appConfig;
    @observable loading;
    @observable openNav;
    @observable projects;
    @observable sessionTimeoutWarning;
    @observable user;

    constructor() {
        this.appConfig = appConfig;
        this.loading = false;
        this.openNav = false;
        this.projects = [];
        this.sessionTimeoutWarning = false;
        this.user = null;

        this.api = api;
    }

    @action getProjects() {
        this.loading = true;
        this.api.getProjects()
            .then(checkStatus).then((response) => {
            const results = response.json();
            const headers = response.headers;
            return Promise.all([results, headers]);
        }).then((json) => {
            this.projects = json[0].results;
            this.loading = false;
        }).catch(ex => this.handleErrors(ex))
    }

    @action checkSessionTimeout() {
        let session = cookie.load('sessionTime');
        if(!session) this.sessionTimeoutWarning = true;
    }

    @action toggleLoading() {
        this.loading = !this.loading;
    }

    @action toggleNav() {
        this.openNav = !this.openNav;
    }

    @action handleErrors(error) {
        this.loading = false;
        if (error && error.response && error.response.status) {
            if (error.response.status === 401) {
                window.location.href = window.location.protocol + '//' + window.location.host + '/#/login';
            }
            // else if (error.response.status === 404 && error.response.statusText !== '' && this.appConfig.apiToken) {
            //     window.location.href = window.location.protocol + '//' + window.location.host + '/#/404';
            //     console.log(error.response);
            // } else {
                // this.displayErrorModals(error);
            // }
        }
    }

    @action getAuthProviders() {
        this.api.getAuthProviders()
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                if (json.results) {
                    const url = json.results.reduce((prev, curr) => {
                        return (curr.is_default) ? curr : prev;
                    }, null);
                    const expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
                    this.appConfig.authServiceId = url.id;
                    cookie.save('authServiceId', this.appConfig.authServiceId, {expires: expiresAt});
                    this.appConfig.authServiceUri = url.login_initiation_url;
                    this.appConfig.authServiceName = url.name;
                    this.appConfig.serviceId = url.service_id;
                }
            }).catch(ex => this.handleErrors(ex));
    }

    @action getApiToken(accessToken) {
        this.api.getApiToken(accessToken, this.appConfig)
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                if (json.api_token) {
                    const expiresAt = new Date(Date.now() + (60 * 60 * 2 * 1000));
                    this.appConfig.apiToken = json.api_token;
                    cookie.save('apiToken', this.appConfig.apiToken, {expires: expiresAt});
                    cookie.save('sessionTime', new Date(Date.now() + ((60 * 60 * 2 * 1000) - 120000)));
                    const redirectUrl = window.sessionStorage.getItem('redirectUrl') ? window.sessionStorage.getItem('redirectUrl') : '/';
                    window.sessionStorage.removeItem('redirectUrl');
                    this.sessionTimeoutWarning = false;
                    document.location.replace(redirectUrl);
                }
            }).catch(ex => mainStore.handleErrors(ex));
    }

    @action handleLogout(status) {
        this.loading = false;
        this.sessionTimeoutWarning = false;
        this.appConfig.apiToken = null;
        cookie.remove('apiToken');
        if(status !== 401) {
            this.appConfig.redirectUrl = null;
            cookie.remove('redirectUrl');
        }
        window.location.assign('/login');
    }

}

const mainStore = new MainStore();

export default mainStore;