import React from 'react'
import { clsx } from 'clsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const PageSkeleton: React.FC = () => {
    return (
        <div
            className={clsx(
                'bg-gradient-to-b from-brand01/40 via-brand02/20 to-30% h-screen',
                'w-full flex flex-col',
                'py-4 gap-4'
            )}
        >
            <div className='w-full flex justify-center'>
                <LoadingSpinner />
            </div>
        </div>
    )
}

export default PageSkeleton
