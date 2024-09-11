import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

const AppLayout = lazy(() => import('@/components/layout/AppLayout.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
const HomePage = lazy(() => import('@/views/home/HomePage.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        children: [
            {
                path: '',
                element: <Navigate to={`/home`} />
            },
            {
                path: 'home',
                element: <HomePage />
            },
            {
                path: '*',
                element: <NotMatch />
            }
        ]
    }
])
