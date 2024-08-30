import React, { Suspense } from 'react'
import PageSkeleton from '@/components/skeleton/PageSkeleton.tsx'
import { Outlet } from 'react-router-dom'
import BottomTabBar from '@/components/layout/BottomTabBar.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'

const MiniAppLayout: React.FC = () => {
    return (
        <>
            <div className='flex-grow flex flex-col'>
                <div className='flex-grow flex flex-col'>
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
            <BottomTabBar />
            <Toaster />
        </>
    )
}

export default MiniAppLayout
