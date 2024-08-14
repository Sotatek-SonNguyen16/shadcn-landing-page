import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import './index.css'
import '@radix-ui/themes/styles.css'
import { Provider } from 'react-redux'
import store from '@/store'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>
)
