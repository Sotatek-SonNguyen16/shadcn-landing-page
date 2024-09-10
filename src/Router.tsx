import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

const MiniAppLayout = lazy(
    () => import('@/components/layout/MiniAppLayout.tsx')
)
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
const HomePage = lazy(() => import('@/views/v2/home/HomePage.tsx'))
const MarketDetailPage = lazy(
    () => import('@/views/v2/detail/MarketDetailPage.tsx')
)
const PortfolioPage = lazy(
    () => import('@/views/v2/portfolio/PortfolioPage.tsx')
)
const ActivitiesPage = lazy(
    () => import('@/views/v2/activities/ActivitiesPage.tsx')
)
const ProfilePage = lazy(() => import('@/views/v2/profile/ProfilePage.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <Navigate to={`/home`} />
    },
    {
        path: '',
        element: <MiniAppLayout />,
        children: [
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
                path: 'activities',
                element: <ActivitiesPage />
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
