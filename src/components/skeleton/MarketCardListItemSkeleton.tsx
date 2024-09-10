import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const MarketCardListItemSkeleton: React.FC = () => {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='flex gap-1'>
                <Skeleton className='h-10 w-full rounded-xl' />
                <Skeleton className='size-10 rounded-xl' />
            </div>
            <Skeleton className='h-20 w-full rounded-xl' />
            <Skeleton className='h-20 w-full rounded-xl' />
            <Skeleton className='h-20 w-full rounded-xl' />
        </div>
    )
}

export default MarketCardListItemSkeleton
