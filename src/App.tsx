import { router } from '@/Router.tsx'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import TonConnectProvider from './provider/tonConnectProvider'

function App() {
    const [tonConnectUI, setOptions] = useTonConnectUI()
    useEffect(() => {
        if (tonConnectUI) {
            TonConnectProvider.setTonConnectUI(tonConnectUI)
        }
    }, [tonConnectUI])

    return <RouterProvider router={router} />
}

export default App
