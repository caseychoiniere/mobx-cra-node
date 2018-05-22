import { observable, action } from 'mobx';
import api from '../api';
import AuthStore from './AuthStore';
import { checkStatus } from '../util/fetchUtil';

export class MainStore {
    // @observable anchorElements;
    // @observable drawers;
    // @observable loading;
    // @observable openNav;

    constructor() {
        this.anchorElements = observable.map();
        this.drawers = observable.map();
        this.loading = false;
        this.openNav = false;
    }

    @action setAnchorElement(anchorEl, i) {
        let a = this.anchorElements;
        !a.has(i) ? a.set(i, anchorEl) : a.delete(i);
        this.anchorElements = a;
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

    @action toggleDrawer(key) {
        !this.drawers.has(key) ? this.drawers.set(key, true) : this.drawers.delete(key);
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