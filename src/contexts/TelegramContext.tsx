import { createContext, useContext, useEffect, useMemo } from 'react'

interface ITelegramContext {}

const TelegramContext = createContext<ITelegramContext | undefined>(undefined)

export const TelegramProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const tg = useMemo(() => (window as any).Telegram.WebApp, [])

    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://telegram.org/js/telegram-web-app.js'
        script.async = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    useEffect(() => {
        tg.ready()
    }, [])

    return (
        <TelegramContext.Provider value={{}}>
            {children}
        </TelegramContext.Provider>
    )
}

export const useTelegram = () => {
    const context = useContext(TelegramContext)
    if (context === undefined) {
        throw new Error('useTelegram must be used within an TelegramContext')
    }
    return context
}
