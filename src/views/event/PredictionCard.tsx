import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import BuyForm from '@/views/event/BuyForm.tsx'
import SellForm from '@/views/event/SellForm.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import HoverCardSelect from '@/components/HoverCardSelect.tsx'
import { EFormType, ESide } from '@/types'
import PredictionCardSkeleton from '@/components/skeleton/PredictionCardSkeleton.tsx'

const tabs: Tab<ESide>[] = [
    {
        title: 'Buy',
        value: ESide.BUY,
        content: <BuyForm />
    },
    {
        title: 'Sell',
        value: ESide.SELL,
        content: <SellForm />
    }
]

const PredictionCard: React.FC = () => {
    const { currentMarket, changeForm, changeType, formType, formStatus } =
        useEventContext()
    const formTypeList: EFormType[] = [EFormType.LIMIT]

    if (!currentMarket) {
        return <PredictionCardSkeleton />
    }

    return (
        <div
            className={`w-[338px] h-fit bg-card rounded-xl border-[1px] border-gray-200 dark:border-slate-700 shadow-lg transition-opacity duration-300 animate-fadeIn`}
        >
            <div className={`flex gap-3 items-center py-4 px-6`}>
                <AvatarPrimitive.Root className='relative h-10 w-10'>
                    <AvatarPrimitive.Image
                        src={currentMarket?.image}
                        alt={currentMarket?.slug}
                        className={clsx(
                            'h-full w-full object-cover rounded-full'
                        )}
                    />
                    <AvatarPrimitive.Fallback
                        className={clsx(
                            'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
                            'rounded-full'
                        )}
                        delayMs={600}
                    ></AvatarPrimitive.Fallback>
                </AvatarPrimitive.Root>

                <div
                    className={`text-xl font-semibold text-gray-700 dark:text-gray-400 flex-1`}
                >
                    {currentMarket?.groupItemTitle}
                </div>
            </div>
            <div className={`w-full relative`}>
                <div className={`absolute top-3 right-0 flex justify-end px-6`}>
                    <HoverCardSelect<EFormType>
                        selected={formType}
                        options={formTypeList}
                        onSelect={changeType}
                    />
                </div>
                <UnderlineTabs<ESide>
                    active={formStatus}
                    tabs={tabs}
                    onClick={changeForm}
                />
            </div>
        </div>
    )
}

export default PredictionCard
