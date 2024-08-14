import dev from './dev.json'
import prod from './prod.json'

export interface Config {
    app: {
        apiUrl: string
        wws: string
    }
    address: string
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
