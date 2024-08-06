import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const EventHeaderSkeleton: React.FC = () => {
    return (
        <div className='flex gap-4 p-3 shadow-sm'>
            <Skeleton className='w-[72px] h-[72px] rounded-full' />
            <div className='flex-1 flex flex-col gap-2'>
                <Skeleton className='h-[16px] w-[50%]' />
                <Skeleton className='flex-1 w-full' />
            </div>
        </div>
    )
}

export default EventHeaderSkeleton
