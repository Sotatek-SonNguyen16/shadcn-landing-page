import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout.tsx'
import { lazy } from 'react'

const DashboardPage = lazy(() => import('@/views/dashboard/DashboardPage.tsx'))
const EventPage = lazy(() => import('@/views/event/EventPage.tsx'))
const MarketPage = lazy(() => import('@/views/market/MarketPage.tsx'))
const TelegramPage = lazy(() => import('@/views/telegram/TelegramPage.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <Navigate to={`/markets`} />
    },
    {
        path: '/dashboard',
        element: <DashboardPage />
    },
    {
        path: '',
        element: <AppLayout />,
        children: [
            {
                path: 'event',
                element: <Navigate to={`/markets`} />
            },
            {
                path: 'event/:id',
                element: <EventPage />
            },
            {
                path: 'markets',
                element: <MarketPage />
            },
            {
                path: 'telegram',
                element: <TelegramPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotMatch />
    }
])
