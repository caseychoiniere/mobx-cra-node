import { observable, action } from 'mobx';
import cookie from 'react-cookies';
import api from '../api';
import AuthStore from './AuthStore';
import { checkStatus } from '../util/fetchUtil';

export class MainStore {
    @observable loading;
    @observable openNav;

    constructor() {
        this.loading = false;
        this.openNav = false;
    }

    @action test() {
        api.test()
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                console.log(json)
            }).catch(er => this.handleErrors(er))
    }

    @action toggleLoading() {
        this.loading = !this.loading;
    }

    @action toggleNav() {
        this.openNav = !this.openNav;
    }

    @action handleErrors(er) {
        this.loading = false;
        if (er.response.status === 401) {
            localStorage.setItem('redirectUrl', window.location.href);
            AuthStore.logout(er);
        }
    }
}

const mainStore = new MainStore();

export default mainStore;