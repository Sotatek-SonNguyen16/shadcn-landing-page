import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const MarketCardGridItemSkeleton: React.FC = () => {
    return (
        <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'>
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <Skeleton className='hidden sm:block h-[125px] w-full rounded-xl' />
            <Skeleton className='hidden sm:block h-[125px] w-full rounded-xl' />
            <Skeleton className='hidden sm:block h-[125px] w-full rounded-xl' />
            <Skeleton className='hidden sm:block h-[125px] w-full rounded-xl' />
        </div>
    )
}

export default MarketCardGridItemSkeleton
