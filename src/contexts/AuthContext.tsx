import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
    useTonAddress,
    useTonConnectModal,
    useTonConnectUI
} from '@tonconnect/ui-react'
import TonConnectProvider from '@/provider/tonConnectProvider.ts'
import { setUser } from '@/store/userSlice.ts'
import Storage from '@/lib/storage.ts'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => Promise<void>
    handleLogout: () => Promise<void>
    userAddress: string | null
    address: string
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const { open } = useTonConnectModal()
    const address = useTonAddress()
    const [tonConnectUI] = useTonConnectUI()

    const dispatch = useDispatch()
    const userAddress = useSelector((state: RootState) => state.user?.address)
    const [isLogin, setIsLogin] = useState<boolean>(!!Storage.getAccessToken())

    const handleLogin = async () => {
        open()
    }

    useEffect(() => {
        if (tonConnectUI) {
            TonConnectProvider.setTonConnectUI(tonConnectUI)
        }
    }, [tonConnectUI])

    useEffect(() => {
        if (address) {
            dispatch(
                setUser({
                    id: '',
                    name: '',
                    address: address
                })
            )
            setIsLogin(true)
            Storage.setAccessToken(address)
        }
    }, [address, dispatch])

    const handleLogout = async () => {
        setIsLogin(false)
        await tonConnectUI.disconnect()
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
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
