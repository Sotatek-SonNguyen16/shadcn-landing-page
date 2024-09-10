import { useEffect, useState } from 'react'
import RequestFactory from '@/services/RequestFactory'
import { BalanceResponse } from '@/types/response.ts'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

const useBalance = () => {
    const [balance, setBalance] = useState<BalanceResponse | null | undefined>(
        undefined
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const { isLogin } = useAuthContext()

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true)
            setError(null)

            try {
                const userRequest = RequestFactory.getRequest('UserRequest')
                const response = await userRequest.getBalance()
                setBalance(response)
            } catch (err) {
                setError('Failed to fetch balance')
            } finally {
                setLoading(false)
            }
        }

        if (isLogin) {
            fetchBalance()
        } else {
            setBalance(undefined)
            setLoading(false)
        }
    }, [isLogin])

    return { balance, loading, error }
}

export default useBalance
