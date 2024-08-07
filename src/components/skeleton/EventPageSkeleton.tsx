import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const EventPageSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='h-[52px] w-[52px] rounded-full' />
                <div className='flex-1 flex flex-col gap-2'>
                    <Skeleton className='h-[32px] w-full' />
                    <Skeleton className='h-[16px] w-[75%]' />
                </div>
            </div>
            <div className='flex gap-2 items-center'>
                <Skeleton className='h-[52px] w-[52px] rounded-full' />
                <div className='flex-1 flex flex-col gap-2'>
                    <Skeleton className='h-[32px] w-full' />
                    <Skeleton className='h-[16px] w-[75%]' />
                </div>
            </div>
            <div className='flex gap-2 items-center'>
                <Skeleton className='h-[52px] w-[52px] rounded-full' />
                <div className='flex-1 flex flex-col gap-2'>
                    <Skeleton className='h-[32px] w-full' />
                    <Skeleton className='h-[16px] w-[75%]' />
                </div>
            </div>
        </div>
    )
}

export default EventPageSkeleton
