import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header.tsx'
import PageSkeleton from '@/components/skeleton/PageSkeleton.tsx'
import ScrollHiddenNavTab from '@/components/layout/ScrollHiddenNavTab.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'

const AppLayout: React.FC = () => {
    return (
        <>
            <Header />
            <div className='flex-grow flex flex-col'>
                <div className='flex-grow flex flex-col'>
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
            <ScrollHiddenNavTab />
            <Toaster />
        </>
    )
}

export default AppLayout
