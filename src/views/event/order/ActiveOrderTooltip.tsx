import React, { useState } from 'react'
import { MarketTrade } from '@/types'
import { Clock3, X } from 'lucide-react'
import * as Progress from '@radix-ui/react-progress'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@/components/ui/hover-card'
import TooltipIcon from '@/components/TooltipIcon.tsx'

const OrderProgress: React.FC<{ progress: number }> = ({ progress }) => {
    return (
        <Progress.Root
            className='relative overflow-hidden bg-green-600 rounded-full w-full h-[5px]'
            style={{
                transform: 'translateZ(0)'
            }}
            value={progress}
        >
            <Progress.Indicator
                className='bg-green-700 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]'
                style={{ transform: `translateX(-${100 - progress}%)` }}
            />
        </Progress.Root>
    )
}

const ActiveOrderTooltip: React.FC<{
    marketTrade: MarketTrade | null
    variant: 'success' | 'accent'
}> = ({ marketTrade, variant }) => {
    const [open, setOpen] = useState<boolean>(false)

    if (!marketTrade) return <></>

    return (
        <TooltipProvider>
            <HoverCard open={open} onOpenChange={setOpen}>
                <HoverCardTrigger asChild>
                    <div
                        className='h-full flex items-center my-1'
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                    >
                        <Clock3
                            className='cursor-pointer'
                            color={variant === 'accent' ? '#ea580c' : '#16a34a'}
                            width={16}
                            height={16}
                        />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent
                    className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                    sideOffset={5}
                    side={`left`}
                    asChild
                >
                    <div
                        className='flex flex-col gap-2 p-2 w-[200px]'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex justify-between text-gray-900 items-center text-[16px] font-bold'>
                            <div>Filled</div>
                            <div>
                                {marketTrade.sizeMatched} / {marketTrade.size}
                            </div>
                        </div>
                        <OrderProgress
                            progress={
                                marketTrade.sizeMatched / marketTrade.size
                            }
                        />
                        <div className='flex justify-between items-center'>
                            <div className='text-gray-400'>
                                {marketTrade.size} remaining
                            </div>
                            <div>
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    type='button'
                                    onClick={() => {}}
                                >
                                    <TooltipIcon
                                        trigger={
                                            <X
                                                color={'#dc2626'}
                                                width={16}
                                                height={16}
                                            />
                                        }
                                        content={`Cancel`}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </TooltipProvider>
    )
}

export default ActiveOrderTooltip
