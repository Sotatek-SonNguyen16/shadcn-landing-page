import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Ellipsis } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import { EBetOption } from '@/types'

const OptionModalToggle = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='secondary' size={'iconGroup'}>
                    <Ellipsis width={20} height={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mb-4 mx-4'>
                <DropdownMenuItem disabled>Merge shares</DropdownMenuItem>
                <DropdownMenuItem>Split shares</DropdownMenuItem>
                <DropdownMenuItem disabled>
                    Remove liquidity (AMM)
                </DropdownMenuItem>
                <DropdownMenuItem>Buy shares</DropdownMenuItem>
                <DropdownMenuItem disabled>Sell shares</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const BetGroupButton: React.FC = () => {
    const { currentMarket, changeBetOption } = useEventContext()
    const { openDrawer } = useDrawerContext()

    const formatterEuro = useMemo(
        () =>
            new Intl.NumberFormat('default', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }),
        []
    )

    const onClickBetButton = (option: EBetOption) => {
        changeBetOption(option)
        openDrawer({
            content: <SaleDrawer />
        })
    }

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-full px-4 py-3',
                'bg-background border-t-[1px] border-gray-200',
                'transition-transform duration-300 ease-in-out'
            )}
        >
            <div className='inline-flex gap-4 w-full items-center'>
                <Button
                    variant='successSolid'
                    className='flex-1 py-6 text-[16px]'
                    onClick={() => onClickBetButton(EBetOption.YES)}
                >
                    Bet{' '}
                    {`${currentMarket?.outcomes[0]} ${formatterEuro.format(Math.round(Number(currentMarket?.outcomePrices[0]) * 100))}`}
                </Button>
                <Button
                    variant='accentSolid'
                    className='flex-1 py-6 text-[16px]'
                    onClick={() => onClickBetButton(EBetOption.NO)}
                >
                    Bet{' '}
                    {`${currentMarket?.outcomes[1]} ${formatterEuro.format(Math.round(Number(currentMarket?.outcomePrices[1]) * 100))}`}
                </Button>
                <OptionModalToggle />
            </div>
        </div>
    )
}

export default BetGroupButton
