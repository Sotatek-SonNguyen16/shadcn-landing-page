import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import useThrottle from '@/hooks/useThrottle.ts'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'

import {
    NavigationMenuItem,
    NavigationMenuLink
} from '@/components/ui/navigation-menu.tsx'
import { AlignJustify, Grip, Radio, Search } from 'lucide-react'
import { cn } from '@/lib/utils.ts'
import { cva } from 'class-variance-authority'

const navigationMenuTriggerStyle = cva(
    'group flex flex-col h-10 w-ful items-center justify-center rounded-md bg-background mx-2 py-2 text-[10px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
)

const ScrollHiddenNavTab: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollTop = useRef<number>(0)

    const handleScroll = useThrottle(() => {
        const currentScrollTop = window.scrollY
        setIsVisible(currentScrollTop <= lastScrollTop.current)
        lastScrollTop.current = currentScrollTop
    }, 100)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: false })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    return (
        <div
            className={clsx(
                'block lg:hidden',
                'fixed bottom-0 left-0 w-full h-auto',
                {
                    'transform translate-y-full': !isVisible,
                    'transform translate-y-0': isVisible
                }
            )}
        >
            <div className='bg-background flex justify-center py-3 md:py-2 px-2 border-y-[1px] border-gray-200'>
                <NavigationMenuPrimitive.Root
                    className={clsx('relative z-10 w-full')}
                >
                    <NavigationMenuPrimitive.List
                        className={clsx(
                            'group flex flex-1 list-none items-center justify-around space-x-1'
                        )}
                    >
                        <NavigationMenuItem className={clsx('flex-1')}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                href='/'
                            >
                                <div>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='15'
                                        height='15'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        className='lucide lucide-house'
                                    >
                                        <path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' />
                                        <path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                                    </svg>
                                </div>
                                Markets
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className={clsx('flex-1')}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                href='/markets'
                            >
                                <div>
                                    <Grip width={15} height={15} />
                                </div>
                                Markets
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className={clsx('flex-1')}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                href='/search'
                            >
                                <div>
                                    <Search width={15} height={15} />
                                </div>
                                Search
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className={clsx('flex-1')}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                href='/activity'
                            >
                                <div>
                                    <Radio width={15} height={15} />
                                </div>
                                Activity
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className={clsx('flex-1')}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                href='/more'
                            >
                                <div>
                                    <AlignJustify width={15} height={15} />
                                </div>
                                More
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuPrimitive.List>
                </NavigationMenuPrimitive.Root>
            </div>
        </div>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className='text-sm font-medium leading-none'>
                        {title}
                    </div>
                    <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = 'ListItem'

export default ScrollHiddenNavTab
