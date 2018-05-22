import {observable} from 'mobx-react';
import * as fake from "../util/testData";
import { sleep, respondOK }  from "../util/testUtil";

describe('Main Store', () => {

    let api = null;
    let MainStore = null;

    beforeEach(() => {
        MainStore = require('../stores/MainStore').default;
        api = {};
        MainStore.api = api;
        console.log(MainStore.loading)
        console.log(MainStore)
    });

    it('@action toggleLoading - should toggle loading state from true to false', () => {
        expect(MainStore.loading).toBe(false);
        MainStore.toggleLoading();
        expect(MainStore.loading).toBe(true);
        MainStore.toggleLoading();
        expect(MainStore.loading).toBe(false);
    });

});