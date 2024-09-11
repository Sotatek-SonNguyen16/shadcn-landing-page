import React from 'react'
import { clsx } from 'clsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const AppLayoutSkeleton: React.FC = () => {
    return (
        <div className={clsx('bg-background h-screen w-full flex flex-col', 'py-4 gap-4')}>
            <div className='w-full flex justify-center'>
                <LoadingSpinner />
            </div>
        </div>
    )
}

export default AppLayoutSkeleton
