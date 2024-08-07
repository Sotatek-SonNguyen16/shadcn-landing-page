const PREFERENCES = 'poly-market'

interface Preferences {
    accessToken?: string
    connectorId?: string
}

const defaultPreferences: Preferences = {}

class Storage {
    static getStorage(): Preferences {
        const preferencesString = localStorage.getItem(PREFERENCES)
        const preferences = JSON.parse(preferencesString || '{}')
        return {
            ...defaultPreferences,
            ...preferences
        }
    }

    static setStorage(type: string, value: object): void {
        localStorage.setItem(type, JSON.stringify(value))
    }

    static init(): void {
        const preferences = this.getStorage()
        this.setStorage(PREFERENCES, preferences)
    }

    static getAccessToken(): string | undefined {
        const { accessToken } = this.getStorage()
        return accessToken
    }

    static setAccessToken(accessToken: string): void {
        const preferences = this.getStorage()
        preferences.accessToken = accessToken
        this.setStorage(PREFERENCES, preferences)
    }

    static clearAccessToken(): void {
        const preferences = this.getStorage()
        delete preferences.accessToken
        this.setStorage(PREFERENCES, preferences)
    }

    static getConnectorId(): string {
        const { connectorId } = this.getStorage()
        return connectorId || ''
    }

    static logout(): void {
        this.clearAccessToken()
    }
}

export default Storage
