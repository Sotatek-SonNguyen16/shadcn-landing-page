import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card.tsx'
import { clsx } from 'clsx'
import { PolyMarket } from '@/types'
import { Button } from '@/components/ui/button.tsx'
import { Gift, MessageCircle, Pin, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils.ts'

const MarketCardGridItem: React.FC<{ data: PolyMarket }> = ({ data }) => {
    const { id, icon, title, markets, volume, commentCount } = data

    return (
        <Card className={clsx('w-full shadow-sm', 'hover:shadow-lg')}>
            <CardHeader>
                <CardTitle className='flex gap-3 items-center h-[42px] min-h-[42px] max-h-[42px]'>
                    <div className='relative'>
                        <div className='w-[38px] min-w-[38px] h-[38px] rounded-[4px] opacity-100'>
                            <img
                                src={icon}
                                alt={title}
                                className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[4px]'
                            />
                        </div>
                    </div>
                    <div className='flex-1 min-w-0 flex justify-between cursor-default'>
                        <a
                            href={`/event/${id}`}
                            className='flex items-center min-w-0 overflow-hidden cursor-pointer text-[16px] hover:underline'
                        >
                            {title}
                        </a>
                    </div>
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className={clsx(
                        'h-[70px] w-full flex flex-col gap-2',
                        'overflow-auto',
                        'scrollbar-hidden'
                    )}
                >
                    {markets
                        .sort(
                            (a, b) =>
                                Number(b.outcomePrices[0]) -
                                Number(a.outcomePrices[0])
                        )
                        .slice(0, 10)
                        .map((market) => (
                            <div
                                key={market.groupItemTitle}
                                className='flex gap-2 items-center'
                            >
                                <div className='font-semibold text-sm text-gray-600 flex-1'>
                                    {market.groupItemTitle}
                                </div>
                                <div className='font-semibold text-gray-500'>
                                    {Math.floor(
                                        Number(market.outcomePrices[0]) * 100
                                    ) < 1
                                        ? '<1'
                                        : Math.floor(
                                              Number(market.outcomePrices[0]) *
                                                  100
                                          )}
                                    %
                                </div>
                                <div className='flex gap-2 h-[25px]'>
                                    <Button
                                        className='flex-1 h-full'
                                        variant={`successGhost`}
                                    >
                                        {market.outcomes[0]}
                                    </Button>
                                    <Button
                                        className='flex-1 h-full'
                                        variant={`accentGhost`}
                                    >
                                        {market.outcomes[0]}
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
            <CardFooter>
                <div className='w-full flex justify-between items-center'>
                    <div className='flex gap-1 items-center'>
                        <div className='bg-blue-100 p-1 rounded'>
                            <Pin width={15} height={15} color={`#1652f0`} />
                        </div>
                        <div>{formatCurrency(Number(volume))} Bet</div>
                    </div>
                    <div className='flex gap-1 items-center text-gray-500'>
                        <Button variant={`outline`} size={`icon`}>
                            <Gift
                                width={15}
                                height={15}
                                className='cursor-pointer'
                            />
                        </Button>
                        <Button
                            variant={`outline`}
                            size={`iconGroup`}
                            className='flex gap-1'
                        >
                            <MessageCircle width={15} height={15} />
                            {commentCount}
                        </Button>
                        <Button variant={`outline`} size={`icon`}>
                            <Star
                                width={15}
                                height={15}
                                className=' cursor-pointer'
                            />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default MarketCardGridItem
