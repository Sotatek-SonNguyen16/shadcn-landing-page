import axios from 'axios'

export const setAuthorizationToRequest = (
    accessToken: string | undefined
): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization']
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
    axios.defaults.headers.common['x-app-version'] = 1
}

export const setAddressToRequest = (
    address: string | undefined | null
): void => {
    if (!address) {
        delete axios.defaults.headers.common['x-address']
    } else {
        axios.defaults.headers.common['x-address'] = `${address}`
    }
    axios.defaults.headers.common['x-app-version'] = 1
}

export const setAuthorizationToRequestLinkWallet = (
    accessToken: string | undefined
): void => {
    if (!accessToken) {
        delete axios.defaults.headers.common['Authorization']
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
    axios.defaults.headers.common['x-app-version'] = 2
}

export const setDefaultAuthorizationToRequest = (): void => {
    delete axios.defaults.headers.common['Authorization']
    axios.defaults.headers.common['x-app-version'] = 1
}
