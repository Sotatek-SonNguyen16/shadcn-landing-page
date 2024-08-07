import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const PredictionCardSkeleton: React.FC = () => {
    return (
        <div
            className={`w-[338px] h-[400px] bg-card rounded-xl border-[1px] border-gray-200 shadow-lg p-3`}
        >
            <Skeleton className='h-[52px] w-[52px] rounded-full mb-3' />
            <div className='flex gap-2 mb-3'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
            </div>
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-16 w-full' />
            </div>
        </div>
    )
}

export default PredictionCardSkeleton
