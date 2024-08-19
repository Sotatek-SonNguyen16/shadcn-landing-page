import dev from './dev.json'
import prod from './prod.json'
import { WalletsListConfiguration } from '@tonconnect/ui-react'
import { ActionConfiguration } from '@tonconnect/ui'

interface App {
    apiUrl: string
    wws: string
}

export interface Config {
    app: App
    walletsListConfiguration: WalletsListConfiguration
    twaReturnUrl: ActionConfiguration
    manifestUrl: string
}

const env = import.meta.env.VITE_NODE_ENV as 'dev' | 'prod'

let config: Config

if (env === 'dev') {
    config = dev as Config
} else if (env === 'prod') {
    config = prod as Config
} else {
    throw new Error(`Unknown environment: ${env}`)
}

export default config
