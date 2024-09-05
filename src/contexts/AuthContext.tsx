import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
    useIsConnectionRestored,
    useTonAddress,
    useTonConnectModal,
    useTonConnectUI,
    useTonWallet
} from '@tonconnect/ui-react'

import TonConnectProvider from '@/provider/tonConnectProvider.ts'
import { setUser } from '@/store/userSlice.ts'
import Storage from '@/lib/storage.ts'
import RequestFactory from '@/services/RequestFactory'
import { setAccessToken } from '@/store/authSlice'
import { jwtDecode } from 'jwt-decode'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => void
    handleLogout: () => Promise<void>
    userAddress: string | null
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

    const dispatch = useDispatch()
    const userAddress = useSelector((state: RootState) => state.user?.address)
    const [isLogin, setIsLogin] = useState<boolean>(!!Storage.getAccessToken())
    const interval = useRef<ReturnType<typeof setInterval> | undefined>()

    const handleLogin = () => {
        open()
    }

    const handleTokenExpiration = async (token: string) => {
        try {
            const decodedToken = jwtDecode<{ exp: number }>(token)
            const expirationTime = decodedToken.exp * 1000

            const currentTime = Date.now()
            const timeUntilExpiration = expirationTime - currentTime
            console.log(timeUntilExpiration <= 0)
            if (timeUntilExpiration <= 0) {
                await handleLogout()
                handleLogin()
            } else {
                setTimeout(() => {
                    handleLogout()
                    handleLogin()
                }, timeUntilExpiration)
            }
        } catch (error) {
            console.debug('Error handling token expiration', error)
            handleLogout()
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

            dispatch(
                setUser({
                    id: '',
                    name: '',
                    address: address
                })
            )
            dispatch(setAccessToken({ accessToken: result.accessToken }))
            setIsLogin(true)
            handleTokenExpiration(result.accessToken)
        } catch (e) {
            console.debug('login error', e)
            handleLogout()
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

            refreshPayload()
            setInterval(refreshPayload, payloadTTLMS)
            return
        }
        login()
    }, [wallet, isConnectionRestored, tonConnectUI])

    useEffect(() => {
        const token = Storage.getAccessToken()
        if (token) {
            handleTokenExpiration(token)
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
        // window.location.reload()
    }

    return (
        <AuthContext.Provider
            value={{ isLogin, handleLogin, handleLogout, userAddress, address }}
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
