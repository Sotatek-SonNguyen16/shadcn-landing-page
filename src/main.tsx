import { ThemeContext } from '@/contexts/ThemeContext.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import '@radix-ui/themes/styles.css'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeContext>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ThemeContext>
)
