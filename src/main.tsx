import { ThemeProvider } from '@/components/theme-provider.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import store from '@/store'
import '@radix-ui/themes/styles.css'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'
import config from '@/configs'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
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
        </Provider>
    </StrictMode>
)
