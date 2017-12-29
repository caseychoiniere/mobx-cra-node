import {observable} from 'mobx-react';
import * as fake from "../util/testData";
import { sleep, respondOK }  from "../util/testUtil";

describe('Main Store', () => {

    let api = null;
    let MainStore = null;

    beforeEach(() => {
        MainStore = require('../stores/mainStore').default;
        api = {};
        MainStore.api = api;
    });

    it('@action getProjects - should return a list of projects', () => {
        expect(MainStore.projects.length).toBe(0);
        api.getProjects = jest.fn((page) => respondOK(fake.projects_json.results));
        MainStore.getProjects();
        sleep(1).then(() => {
            expect(api.getProjects).toHaveBeenCalledTimes(1);
            expect(MainStore.projects.length).toBe(2);
        });
    });

    it('@action getProjects - should return an empty array', () => {
        expect(MainStore.projects.length).toBe(0);
        api.getProjects = jest.fn((page) => respondOK([]));
        MainStore.getProjects();
        sleep(1).then(() => {
            expect(api.getProjects).toHaveBeenCalledTimes(1);
            expect(MainStore.projects.length).toBe(0);
        });
    });

});