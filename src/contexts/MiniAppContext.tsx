import React, { createContext, ReactNode, useContext } from 'react'
import { useToast } from '@/components/ui/use-toast.ts'

interface MiniAppState {}

interface MiniAppContextProps extends MiniAppState {
    showComingSoon: () => void
}

const MiniAppContext = createContext<MiniAppContextProps | undefined>(undefined)

export const MiniAppProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { toast } = useToast()

    const showComingSoon = () => {
        toast({
            variant: 'default',
            title: 'Coming Soon!'
        })
    }

    const value = {
        showComingSoon
    }

    return (
        <MiniAppContext.Provider value={value}>
            {children}
        </MiniAppContext.Provider>
    )
}

export const useMiniAppContext = (): MiniAppContextProps => {
    const context = useContext(MiniAppContext)

    if (!context) {
        throw new Error(
            'useMiniAppContext must be used within a MiniAppProvider'
        )
    }

    return context
}
