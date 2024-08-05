import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import BuyForm from '@/views/event/BuyForm.tsx'
import SellForm from '@/views/event/SellForm.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import HoverCardSelect from '@/components/HoverCardSelect.tsx'
import { EFormType, ESide } from '@/types'

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
    const src =
        'https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-kamala-harris-win-the-2024-us-presidential-election-21483ac3-94a5-4efd-b89e-05cdca69753f.png&w=96&q=100'
    const { changeForm, changeType, formType } = useEventContext()
    const formTypeList: EFormType[] = Object.values(EFormType)

    return (
        <div
            className={`w-[338px] h-fit bg-card rounded-xl border-[1px] border-gray-200 shadow-lg`}
        >
            <div className={`flex gap-2 items-center py-4 px-6`}>
                <AvatarPrimitive.Root className='relative inline-flex h-10 w-10'>
                    <AvatarPrimitive.Image
                        src={src}
                        alt='Avatar'
                        className={clsx(
                            'h-full w-full object-cover',
                            'rounded-full'
                        )}
                    />
                    <AvatarPrimitive.Fallback
                        className={clsx(
                            'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
                            'rounded-full'
                        )}
                        delayMs={600}
                    >
                        <span className='text-sm font-bold uppercase text-gray-700 dark:text-gray-400'>
                            Kamala Harris
                        </span>
                    </AvatarPrimitive.Fallback>
                </AvatarPrimitive.Root>

                <div
                    className={`font-semibold text-gray-700 dark:text-gray-400`}
                >
                    Kamala Harris
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
                <UnderlineTabs<ESide> tabs={tabs} onClick={changeForm} />
            </div>
        </div>
    )
}

export default PredictionCard
