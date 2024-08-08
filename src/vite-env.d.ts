/// <reference types="vite/client" />

declare const global: {
    basename: string
}

interface ImportMetaEnv {
    readonly VITE_NODE_ENV: string
    readonly VITE_TELEGRAM_TOKEN: string
}
