import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const EventOrderBookSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col gap-1 py-3'>
            <Skeleton className='h-[80px] w-full' />
            <Skeleton className='h-[32px] w-full' />
            <Skeleton className='h-[80px] w-full' />
        </div>
    )
}

export default EventOrderBookSkeleton
