import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ActiveOrder } from '@/types'
import { Clock3, X } from 'lucide-react'
import * as Progress from '@radix-ui/react-progress'

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
    activeOrder: ActiveOrder | null
    variant: 'success' | 'accent'
}> = ({ activeOrder, variant }) => {
    if (!activeOrder) return <></>

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Clock3
                        className='cursor-pointer'
                        color={variant === 'accent' ? '#ea580c' : '#16a34a'}
                        width={16}
                        height={16}
                    />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                        sideOffset={5}
                        side={`left`}
                        asChild
                    >
                        <div className='flex flex-col gap-2 p-2 w-[200px]'>
                            <div className='flex justify-between items-center text-[16px] font-bold'>
                                <div>{activeOrder.status}</div>
                                <div>0 / 5</div>
                            </div>
                            <OrderProgress progress={10} />
                            <div className='flex justify-between items-center'>
                                <div className='text-gray-400'>5 remaining</div>
                                <div>
                                    <X
                                        color={'#dc2626'}
                                        width={16}
                                        height={16}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}

export default ActiveOrderTooltip
