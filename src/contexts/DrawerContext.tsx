import React, { createContext, useContext, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerTitle
} from '@/components/ui/drawer.tsx'
import { clsx } from 'clsx'

interface DrawerContextReturnValue {
    openDrawer: (data: {
        title?: JSX.Element
        description?: JSX.Element
        content: JSX.Element
        footer?: JSX.Element
    }) => void
}

interface DrawerProviderProps {
    children: JSX.Element
    // drawer: JSX.Element
}

const DrawerContext = createContext<DrawerContextReturnValue | undefined>(
    undefined
)

interface DrawerProps {
    open: boolean
    title?: JSX.Element
    description?: JSX.Element
    content?: JSX.Element
    footer?: JSX.Element
}

const initialDrawer: DrawerProps = {
    open: false
}

const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
    const [drawer, setDrawer] = useState<DrawerProps>(initialDrawer)

    const openDrawer = (data: {
        title?: JSX.Element
        description?: JSX.Element
        content: JSX.Element
        footer?: JSX.Element
    }) => {
        setDrawer({
            open: true,
            title: data.title,
            description: data.description,
            content: data.content,
            footer: data.footer
        })
    }

    return (
        <DrawerContext.Provider value={{ openDrawer }}>
            {children}
            <Drawer
                open={drawer.open}
                onOpenChange={(open) =>
                    setDrawer((prevState) => ({ ...prevState, open: open }))
                }
                modal={true}
                shouldScaleBackground={true}
            >
                <DrawerContent>
                    <div
                        className={clsx(
                            'max-h-screen',
                            'overflow-y-scroll scrollbar-hidden'
                        )}
                    >
                        <DrawerTitle>{drawer.title}</DrawerTitle>
                        <DrawerDescription>
                            {drawer.description}
                        </DrawerDescription>
                        {drawer.content}
                        <DrawerFooter>{drawer.footer}</DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </DrawerContext.Provider>
    )
}

const useDrawerContext = () => {
    const context = useContext(DrawerContext)
    if (context === undefined) {
        throw new Error(
            'useDrawerContext must be used within an DrawerProvider'
        )
    }
    return context
}

export { useDrawerContext }
export default DrawerProvider
