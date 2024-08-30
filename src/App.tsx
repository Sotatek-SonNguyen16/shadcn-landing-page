import { router } from '@/Router.tsx'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}

export default App
