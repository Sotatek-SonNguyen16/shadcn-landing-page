import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const EventPageSkeleton: React.FC = () => {
    return (
        <div className='w-full flex flex-col gap-3'>
            <Skeleton className='flex flex-col gap-3 bg-color-neutral-250 p-3 rounded-xl '>
                <Skeleton className='size-10 rounded-full' />
                <div className='grid grid-cols-2 gap-2'>
                    <Skeleton className='h-10' />
                    <Skeleton className='h-10' />
                </div>
            </Skeleton>
            <Skeleton className='flex flex-col gap-3 bg-color-neutral-250 p-3 rounded-xl '>
                <Skeleton className='size-10 rounded-full' />
                <div className='grid grid-cols-2 gap-2'>
                    <Skeleton className='h-10' />
                    <Skeleton className='h-10' />
                </div>
            </Skeleton>
            <Skeleton className='flex flex-col gap-3 bg-color-neutral-250 p-3 rounded-xl '>
                <Skeleton className='size-10 rounded-full' />
                <div className='grid grid-cols-2 gap-2'>
                    <Skeleton className='h-10' />
                    <Skeleton className='h-10' />
                </div>
            </Skeleton>
        </div>
    )
}

export default EventPageSkeleton
