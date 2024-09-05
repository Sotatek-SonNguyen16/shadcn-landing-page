import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout.tsx'
import { lazy } from 'react'
import MiniAppLayout from '@/components/layout/MiniAppLayout.tsx'

const EventPage = lazy(() => import('@/views/event/EventPage.tsx'))
const MarketPage = lazy(() => import('@/views/market/MarketPage.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))

// ui version 2
const HomePage = lazy(() => import('@/views/v2/home/HomePage.tsx'))
const MarketDetailPage = lazy(
    () => import('@/views/v2/detail/MarketDetailPage.tsx')
)
const PortfolioPage = lazy(
    () => import('@/views/v2/portfolio/PortfolioPage.tsx')
)
const ProfilePage = lazy(() => import('@/views/v2/profile/ProfilePage.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <Navigate to={`/v2/home`} />
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
            }
        ]
    },
    {
        path: '/v2',
        element: <MiniAppLayout />,
        children: [
            {
                path: '/v2',
                element: <Navigate to={`/v2/home`} />
            },
            {
                path: 'event/:id',
                element: <MarketDetailPage />
            },
            {
                path: 'home',
                element: <HomePage />
            },
            {
                path: 'portfolio',
                element: <PortfolioPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: '*',
                element: <NotMatch />
            }
        ]
    },
    {
        path: '*',
        element: <NotMatch />
    }
])
