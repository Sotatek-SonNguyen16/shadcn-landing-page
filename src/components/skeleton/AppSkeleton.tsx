import React from 'react'
import { clsx } from 'clsx'

const AppSkeleton: React.FC = () => {
    return (
        <div
            className={clsx(
                'bg-gradient-to-b from-brand01/40 via-brand02/20 to-30% h-screen',
                'w-full'
            )}
        ></div>
    )
}

export default AppSkeleton
