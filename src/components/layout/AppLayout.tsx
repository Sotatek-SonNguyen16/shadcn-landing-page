import React, { Suspense } from 'react'
import AppLayoutSkeleton from '@/components/skeleton/AppLayoutSkeleton.tsx'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster.tsx'

const AppLayout: React.FC = () => {
    return (
        <div className='flex-grow flex flex-col'>
            <div className='flex-grow flex flex-col'>
                <Suspense fallback={<AppLayoutSkeleton />}>
                    <Outlet />
                </Suspense>
            </div>
            <Toaster />
        </div>
    )
}

export default AppLayout
