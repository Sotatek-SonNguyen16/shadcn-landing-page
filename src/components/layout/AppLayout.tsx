import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header.tsx'
import PageSkeleton from '@/components/skeleton/PageSkeleton.tsx'

const AppLayout: React.FC = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<PageSkeleton />}>
                <div className='flex-grow flex flex-col'>
                    <div className='container px-4 md:px-8 flex-grow flex flex-col'>
                        <Outlet />
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default AppLayout
