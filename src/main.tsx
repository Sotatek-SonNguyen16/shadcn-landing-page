import { ThemeProvider } from '@/components/theme-provider.tsx'
import config from '@/configs'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import '@radix-ui/themes/styles.css'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <TonConnectUIProvider
            manifestUrl={config.manifestUrl}
            uiPreferences={{ theme: THEME.DARK }}
            walletsListConfiguration={config.walletsListConfiguration}
            actionsConfiguration={config.twaReturnUrl}
        >
            <AuthProvider>
                <App />
            </AuthProvider>
        </TonConnectUIProvider>
    </ThemeProvider>
)
