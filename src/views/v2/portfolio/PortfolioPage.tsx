import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import { ArrowUp } from 'lucide-react'
import { UnderlineTabs } from '@/components/ui/tabs.tsx'
import PortfolioPositionContent from '@/views/v2/portfolio/PortfolioPositionContent.tsx'
import PortfolioOpenOrdersContent from '@/views/v2/portfolio/PortfolioOpenOrdersContent.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import { PortfolioProvider } from '@/contexts/PortfolioContext.tsx'
import useBalance from '@/hooks/useBalance.ts'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

const PortfolioTitle = () => {
    return (
        <div className='flex-1 px-4 rounded-lg justify-start items-center gap-2 inline-flex'>
            <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                <div className='self-stretch text-color-color-neutral-900 text-2xl font-semibold leading-loose'>
                    Portfolio
                </div>
            </div>
        </div>
    )
}

const PortfolioBalance = memo(() => {
    const { balance, loading } = useBalance()
    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
            }),
        []
    )

    if (loading) {
        return (
            <div className='h-20 flex-1 p-4 flex-col justify-center items-start gap-4 inline-flex'>
                <Skeleton className='w-[20vw] h-10 bg-color-neutral-500' />
                <Skeleton className='w-[10vw] h-8 bg-color-neutral-250 rounded-2xl' />
            </div>
        )
    }

    if (!balance) {
        return (
            <div className='flex-1 p-4 flex-col justify-center items-start gap-4 inline-flex'>
                <div className='self-stretch text-color-neutral-900 text-4xl font-normal leading-10'>
                    Let connect wallet
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 p-4 flex-col justify-center items-start gap-4 inline-flex'>
            <div className='self-stretch text-color-neutral-900 text-4xl font-normal leading-10'>
                {formatterUSD.format(Number(balance?.cashUsd))}
            </div>
            <div className='px-3 py-2 bg-color-neutral-100 rounded-2xl justify-center items-center gap-1 inline-flex'>
                <div className='pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch text-color-accent-green-900 text-xs font-normal leading-none'>
                        +207.99
                    </div>
                </div>
                <ArrowUp size={16} className='text-color-accent-green-900' />
            </div>
        </div>
    )
})

const PortfolioPage: React.FC = () => {
    const { isLogin, handleLogin } = useAuthContext()

    useEffect(() => {
        if (!isLogin) {
            handleLogin()
        }
    }, [isLogin])

    const _renderContent = useCallback(() => {
        if (!isLogin) return null

        return (
            <div className='min-w-[200px] w-full p-4 bg-color-neutral-alpha-900 rounded-tl-2xl rounded-tr-2xl border-t border-color-neutral-50'>
                <UnderlineTabs<'position' | 'order'>
                    defaultValue={'position'}
                    tabs={[
                        {
                            title: 'Positions',
                            value: 'position',
                            content: <PortfolioPositionContent />
                        },
                        {
                            title: 'Open Orders',
                            value: 'order',
                            content: <PortfolioOpenOrdersContent />
                        }
                    ]}
                />
            </div>
        )
    }, [isLogin])

    return (
        <PortfolioProvider>
            <div
                className={clsx(
                    'bg-gradient-to-br from-[#97C198] from-5% via-[#C1BF7E] via-10% to-[#0A0A0500] to-20%',
                    'w-full flex flex-col',
                    'pt-4 gap-4'
                )}
            >
                <DrawerProvider>
                    <PortfolioTitle />
                </DrawerProvider>
                <PortfolioBalance />
                {_renderContent()}
            </div>
        </PortfolioProvider>
    )
}

export default PortfolioPage
