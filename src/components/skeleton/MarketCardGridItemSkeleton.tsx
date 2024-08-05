import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const MarketCardGridItemSkeleton: React.FC = () => {
    return (
        <div className='grid grid-cols-4 gap-4'>
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
        </div>
    )
}

export default MarketCardGridItemSkeleton
