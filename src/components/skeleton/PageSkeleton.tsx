import React from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const PageSkeleton: React.FC = () => {
    return (
        <div className='container px-4 md:px-8 flex items-center space-x-4 mt-3'>
            <div className='space-y-2'>
                <Skeleton className='h-4 w-[350px]' />
                <Skeleton className='h-4 w-[300px]' />
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
            </div>
        </div>
    )
}

export default PageSkeleton
