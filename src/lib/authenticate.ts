import axios from 'axios';

export const setAuthorizationToRequest = (accessToken: string | undefined): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization'];
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    axios.defaults.headers.common['x-app-version'] = 1;
};

export const setAuthorizationToRequestLinkWallet = (accessToken: string | undefined): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization'];
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    axios.defaults.headers.common['x-app-version'] = 2;
};

export const setDefaultAuthorizationToRequest = (): void => {
    axios.defaults.headers.common['x-app-version'] = 1;
};
