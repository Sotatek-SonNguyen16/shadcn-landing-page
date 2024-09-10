import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import {
    useIsConnectionRestored,
    useTonAddress,
    useTonConnectModal,
    useTonConnectUI,
    useTonWallet
} from '@tonconnect/ui-react'

import TonConnectProvider from '@/provider/tonConnectProvider.ts'
import Storage from '@/lib/storage.ts'
import RequestFactory from '@/services/RequestFactory'
import { jwtDecode } from 'jwt-decode'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => Promise<void>
    handleLogout: () => Promise<void>
    address: string
}

const payloadTTLMS = 1000 * 60 * 20

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const { open } = useTonConnectModal()
    const address = useTonAddress()
    const [tonConnectUI] = useTonConnectUI()
    const isConnectionRestored = useIsConnectionRestored()
    const wallet = useTonWallet()

    const [isLogin, setIsLogin] = useState<boolean>(!!Storage.getAccessToken())
    const interval = useRef<ReturnType<typeof setInterval> | undefined>()

    const handleLogin = async () => {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect()
        }
        open()
    }

    const handleTokenExpiration = async (token: string) => {
        try {
            const decodedToken = jwtDecode<{ exp: number }>(token)
            const expirationTime = decodedToken.exp * 1000

            const currentTime = Date.now()
            const timeUntilExpiration = expirationTime - currentTime
            if (timeUntilExpiration <= 0) {
                await handleLogout()
                await handleLogin()
            } else {
                setTimeout(() => {
                    handleLogout()
                    handleLogin()
                }, timeUntilExpiration)
            }
        } catch (error) {
            console.debug('Error handling token expiration', error)
            await handleLogout()
        }
    }

    const login = async () => {
        if (
            !wallet?.connectItems?.tonProof ||
            'error' in wallet.connectItems.tonProof
        ) {
            return
        }

        try {
            const authService = RequestFactory.getRequest('AuthRequest')
            const result = await authService.login(
                wallet.connectItems.tonProof.proof,
                wallet.account
            )

            setIsLogin(true)
            Storage.setUserAddress(address)
            Storage.setAccessToken(result.accessToken)
            await handleTokenExpiration(result.accessToken)
        } catch (e) {
            console.debug('login error', e)
            await handleLogout()
        }
    }

    useEffect(() => {
        if (!isConnectionRestored) {
            return
        }
        const authService = RequestFactory.getRequest('AuthRequest')

        clearInterval(interval.current)
        if (!wallet) {
            Storage.clearAccessToken()

            const refreshPayload = async () => {
                tonConnectUI.setConnectRequestParameters({ state: 'loading' })

                const value = await authService.generatePayload()
                if (!value) {
                    tonConnectUI.setConnectRequestParameters(null)
                } else {
                    tonConnectUI.setConnectRequestParameters({
                        state: 'ready',
                        value: {
                            tonProof: value.payload
                        }
                    })
                }
            }

            refreshPayload().then()
            setInterval(refreshPayload, payloadTTLMS)
            return
        }
        login().then()
    }, [wallet, isConnectionRestored, tonConnectUI])

    useEffect(() => {
        const token = Storage.getAccessToken()
        if (token) {
            handleTokenExpiration(token).then()
        }
    }, [])

    useEffect(() => {
        if (tonConnectUI) {
            TonConnectProvider.setTonConnectUI(tonConnectUI)
        }
    }, [tonConnectUI])

    const handleLogout = async () => {
        setIsLogin(false)
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect()
        }
        localStorage.clear()
        sessionStorage.clear()
    }

    return (
        <AuthContext.Provider
            value={{ isLogin, handleLogin, handleLogout, address }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = (): AuthContextProps => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
