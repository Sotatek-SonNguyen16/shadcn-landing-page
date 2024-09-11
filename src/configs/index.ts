import dev from './dev.json'
import prod from './prod.json'
import staging from './staging.json'
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

// Environment types
type NodeEnv = 'dev' | 'prod' | 'staging'

const configMap: Record<NodeEnv, Config> = {
    dev: dev as Config,
    prod: prod as Config,
    staging: staging as Config
}

class ConfigManager {
    private static instance: ConfigManager
    private readonly config: Config

    private constructor(env: NodeEnv) {
        this.config = configMap[env]
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            const env = import.meta.env.VITE_NODE_ENV as NodeEnv
            if (!env || !configMap[env]) {
                throw new Error(`Unknown or missing environment: ${env}`)
            }
            ConfigManager.instance = new ConfigManager(env)
        }
        return ConfigManager.instance
    }

    public getConfig(): Config {
        return this.config
    }
}

export { ConfigManager }
export default ConfigManager.getInstance().getConfig()
