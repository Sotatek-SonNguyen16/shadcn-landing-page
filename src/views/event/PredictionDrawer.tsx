import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import { UnderlineTabs } from '@/components/ui/tabs.tsx'
import MarketEventAbout from '@/views/v2/detail/MarketEventAbout.tsx'
import MarketEventChart from '@/views/v2/detail/MarketEventChart.tsx'
import BetGroupButton from '@/views/BetGroupButton.tsx'
import DynamicHeightDiv from '@/components/DynamicHeightDiv.tsx'

const PredictionDrawer: React.FC = () => {
    const { currentMarket } = useEventContext()

    return (
        <DrawerProvider>
            <div className={clsx('w-full h-full flex flex-col gap-2 px-4')}>
                <div className={`flex gap-3 items-start mb-2`}>
                    <AvatarPrimitive.Root className='relative size-10'>
                        <AvatarPrimitive.Image
                            src={currentMarket?.image}
                            alt={currentMarket?.slug}
                            className={clsx(
                                'size-full object-cover rounded-full'
                            )}
                        />
                        <AvatarPrimitive.Fallback
                            className={clsx(
                                'flex size-full items-center justify-center bg-white dark:bg-gray-800',
                                'rounded-lg'
                            )}
                            delayMs={600}
                        ></AvatarPrimitive.Fallback>
                    </AvatarPrimitive.Root>
                    <div className='flex-1 flex justify-between items-center'>
                        <div className='text-color-neutral-900 text-base font-semibold leading-normal'>
                            {currentMarket?.question ?? ''}
                        </div>
                    </div>
                </div>
                <UnderlineTabs<'chart' | 'about'>
                    defaultValue={'chart'}
                    tabs={[
                        {
                            title: 'Chart',
                            value: 'chart',
                            content: <MarketEventChart />
                        },
                        {
                            title: 'About',
                            value: 'about',
                            content: <MarketEventAbout />
                        }
                    ]}
                />
                <DynamicHeightDiv className='mt-3'>
                    <BetGroupButton />
                </DynamicHeightDiv>
            </div>
        </DrawerProvider>
    )
}

export default PredictionDrawer
