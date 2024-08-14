import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setUser } from '@/store/userSlice'
import config from '@/configs'
import { setAccessToken } from '@/store/authSlice'
import { setAuthorizationToRequest } from '@/lib/authenticate'

interface AuthContextProps {
    isLogin: boolean
    handleLogin: () => void
    handleLogout: () => void
    userAddress: string | null
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const dispatch = useDispatch()
    const userAddress = useSelector((state: RootState) => state.user?.address)
    const [isLogin, setIsLogin] = useState<boolean>(
        userAddress !== null && userAddress !== ''
    )

    const handleLogin = useCallback(async () => {
        try {
            setIsLogin(true)
            const token = 'myToken'
            dispatch(setAccessToken(token))
            setAuthorizationToRequest(token)
            dispatch(
                setUser({
                    id: '',
                    name: '',
                    address: config.address
                })
            )
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        if (!userAddress) {
            handleLogin()
        }
    }, [handleLogin, userAddress])

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
    }

    return (
        <AuthContext.Provider
            value={{ isLogin, handleLogin, handleLogout, userAddress }}
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
