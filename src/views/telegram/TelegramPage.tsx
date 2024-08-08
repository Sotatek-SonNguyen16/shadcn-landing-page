import React from 'react'
import { TelegramProvider } from '@/contexts/TelegramContext.tsx'
import TelegramContent from '@/views/telegram/TelegramContent.tsx'

const TelegramPage: React.FC = () => {
    return (
        <TelegramProvider>
            <TelegramContent />
        </TelegramProvider>
    )
}

export default TelegramPage
