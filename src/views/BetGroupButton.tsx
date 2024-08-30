import React, { useState } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Ellipsis } from 'lucide-react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import { EBetOption, ESide } from '@/types'
import { formatToCents } from '@/lib/utils.ts'
import { CircleCheckBold } from '@/components/icon.tsx'
import MoreActionsDrawer from '@/views/v2/detail/MoreActionsDrawer.tsx'

const BetGroupButton: React.FC = () => {
    const { currentMarket, changeBetOption, formStatus, betOption } =
        useEventContext()
    const { openDrawer } = useDrawerContext()
    const onClickBetButton = (option: EBetOption) => {
        changeBetOption(option)
        openDrawer({
            background: 'bg-color-neutral-alpha-800',
            content: <SaleDrawer />
        })
    }

    const onClickMoreActionsButton = () => {
        openDrawer({
            transparent: true,
            background: 'bg-color-neutral-50',
            content: <MoreActionsDrawer />
        })
    }

    const [outcome] = useState<boolean>(false)

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-full',
                'transition-transform duration-300 ease-in-out'
            )}
        >
            {outcome ? (
                <div className='w-full px-4 py-3 rounded-lg justify-center items-center gap-1 inline-flex'>
                    <div>
                        <CircleCheckBold color='#DFFE0F' />
                    </div>
                    <div className='self-stretch text-color-brand-500 text-sm font-light leading-tight'>
                        Outcome: YES
                    </div>
                </div>
            ) : (
                <div className='w-full px-4 py-3 backdrop-blur-xl justify-start items-start gap-1 flex'>
                    <Button
                        variant='successGhost'
                        className='flex-1 px-4 py-2.5 lg:py-6 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={() => onClickBetButton(EBetOption.YES)}
                    >
                        <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                            <div className='self-stretch text-center text-sm font-semibold leading-tight'>
                                {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                                {currentMarket?.outcomes[0] ?? ''}
                            </div>
                            <div
                                className={clsx(
                                    'self-stretch text-center text-xs font-light leading-3',
                                    {
                                        'text-color-accent-green-700':
                                            betOption === EBetOption.NO
                                    }
                                )}
                            >
                                {formatToCents(
                                    Number(
                                        currentMarket?.outcomePrices[0] ?? 0
                                    ),
                                    1
                                )}
                            </div>
                        </div>
                    </Button>
                    <Button
                        variant='accentGhost'
                        className='flex-1 px-4 py-2.5 lg:py-6 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={() => onClickBetButton(EBetOption.NO)}
                    >
                        <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                            <div className='self-stretch text-center text-sm font-semibold leading-tight'>
                                {formStatus === ESide.SELL ? 'Bet' : 'Sell'}{' '}
                                {currentMarket?.outcomes[1] ?? ''}
                            </div>
                            <div
                                className={clsx(
                                    'self-stretch text-center text-xs font-light leading-3',
                                    {
                                        'text-color-accent-red-700':
                                            betOption === EBetOption.YES
                                    }
                                )}
                            >
                                {formatToCents(
                                    Number(
                                        currentMarket?.outcomePrices[1] ?? 0
                                    ),
                                    1
                                )}
                            </div>
                        </div>
                    </Button>
                    <div
                        className='hidden p-2.5 bg-white/5 rounded-lg justify-center items-center gap-2 cursor-pointer'
                        onClick={onClickMoreActionsButton}
                    >
                        <div className='w-5 h-5 px-1 justify-center items-center flex'>
                            <Ellipsis size={20} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BetGroupButton
