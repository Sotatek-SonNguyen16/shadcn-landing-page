import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import { useMiniAppContext } from '@/contexts/MiniAppContext.tsx'

const ActivitiesPage: React.FC = () => {
    const { showComingSoon } = useMiniAppContext()

    useEffect(() => {
        showComingSoon()
    }, [])

    return (
        <div
            className={clsx(
                'bg-gradient-to-b from-brand01/40 via-brand02/20 to-30% h-screen',
                'w-full'
            )}
        ></div>
    )
}

export default ActivitiesPage
