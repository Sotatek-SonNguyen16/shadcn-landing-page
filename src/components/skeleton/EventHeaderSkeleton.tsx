import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const EventHeaderSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col gap-4 items-center'>
            <Skeleton className='size-20 rounded-full' />
            <Skeleton className='h-8 w-[40vw]' />
            <Skeleton className='h-4 w-[25vh]' />
        </div>
    )
}

export default EventHeaderSkeleton
