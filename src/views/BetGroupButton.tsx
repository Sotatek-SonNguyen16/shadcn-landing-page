import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Ellipsis } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

const OptionModalToggle = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className='py-6'>
                    <Ellipsis width={24} height={24} />
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
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollTop = useRef<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY
            if (currentScrollTop > lastScrollTop.current) {
                // Scrolling down
                setIsVisible(false)
            } else {
                // Scrolling up
                setIsVisible(true)
            }
            lastScrollTop.current = currentScrollTop
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-full px-5 py-5',
                'bg-background border-[1px] border-gray-200',
                'transition-transform duration-300 ease-in-out',
                {
                    'bottom-[56px]': isVisible,
                    'translate-y-0': !isVisible
                }
            )}
        >
            <div className='inline-flex gap-2 w-full'>
                <Button variant='successSolid' className='flex-1 py-6'>
                    Bet
                </Button>
                <Button variant='accentSolid' className='flex-1 py-6'>
                    Bet
                </Button>
                <OptionModalToggle />
            </div>
        </div>
    )
}

export default BetGroupButton
