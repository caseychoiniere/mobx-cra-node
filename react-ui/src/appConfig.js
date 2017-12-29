import cookie from 'react-cookies';

let appConfig = {
    authServiceId: cookie.load('authServiceId'),
    serviceId: null,
    authServiceUri: null,
    authServiceName:  null,
    apiToken: cookie.load('apiToken'),
    isLoggedIn: null,
    currentUser: null
};

export default appConfig;