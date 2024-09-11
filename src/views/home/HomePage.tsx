import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import useComingSoon from '@/hooks/useComingSoon.ts'

const HomePage: React.FC = () => {
    const { showComingSoon } = useComingSoon()

    useEffect(() => {
        showComingSoon()
    }, [])

    return <div className={clsx('bg-background')}>ReactTs Base Ui</div>
}

export default HomePage
