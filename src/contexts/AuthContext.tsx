import React, { createContext, useContext, useEffect, useState } from 'react'
import Storage from '@/lib/storage.ts'
import RequestFactory from '@/services/RequestFactory'
import { jwtDecode } from 'jwt-decode'
import { setDefaultAuthorizationToRequest } from '@/lib/authenticate.ts'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => Promise<void>
    handleLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [isLogin, setIsLogin] = useState<boolean>(
        !!Storage.getPreference('accessToken')
    )

    const handleLogin = async () => {
        await login()
    }

    const handleLogout = async () => {
        setIsLogin(false)
        setDefaultAuthorizationToRequest()
        localStorage.clear()
        sessionStorage.clear()
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
            await handleLogout()
        }
    }

    const login = async () => {
        try {
            const authService = RequestFactory.getRequest('AuthRequest')
            await authService.login()

            setIsLogin(true)
            Storage.setPreference('accessToken', '')
            await handleTokenExpiration('')
        } catch (e) {
            await handleLogout()
        }
    }

    useEffect(() => {
        const token = Storage.getPreference('accessToken')
        if (token) {
            handleTokenExpiration(token).then()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isLogin, handleLogin, handleLogout }}>
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
