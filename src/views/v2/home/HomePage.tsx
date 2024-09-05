import React from 'react'
import MarketProvider from '@/contexts/MarketsContext.tsx'
import { clsx } from 'clsx'
import WalletButton from '@/components/WalletButton.tsx'
import MarketBannerCarousel from '@/views/v2/home/MarketBannerCarousel.tsx'
import MarketListLayout from '@/views/market/MarketListLayout.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import useTelegram from '@/hooks/useTelegram.ts'

const HomePage: React.FC = () => {
    const { user } = useTelegram()

    return (
        <MarketProvider>
            <DrawerProvider>
                <div
                    className={clsx(
                        'bg-gradient-to-b from-brand01/40 via-brand02/20 to-30% h-full',
                        'w-full flex flex-col',
                        'py-4 gap-4'
                    )}
                >
                    <div
                        className={clsx(
                            'flex items-center justify-between',
                            'px-4'
                        )}
                    >
                        <div className='flex-1'>
                            <WalletButton />
                        </div>
                        {user && (
                            <Avatar className='relative inline-flex h-8 w-8'>
                                <AvatarImage
                                    src={user?.photo_url ?? ''}
                                    className='h-full w-full object-cover rounded-full'
                                />
                                <AvatarFallback className='flex h-full w-full items-center justify-center bg-color-neutral-250 rounded-full'>
                                    {user?.first_name && user.last_name
                                        ? user?.first_name[0] +
                                          user?.last_name[0]
                                        : ''}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    <div className='px-4 w-full'>
                        <div className='text-color-neutral-900 text-3xl font-semibold leading-9 text-wrap'>
                            Your Winning Streak Starts Here!
                        </div>
                    </div>
                    <div>
                        <MarketBannerCarousel />
                    </div>
                    <div className='px-4'>
                        <MarketListLayout layout='list' filter={true} />
                    </div>
                </div>
            </DrawerProvider>
        </MarketProvider>
    )
}

export default HomePage
