import * as React from 'react'

import { cn } from '@/lib/utils'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Activity, Flag, Grip, Trophy } from 'lucide-react'

export function MarketsNavigateMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <NavigationMenuLink
                            className={`flex flex-col items-center gap-1`}
                            href='/docs'
                        >
                            <div>
                                <Grip width={15} height={15} />
                            </div>
                            Markets
                        </NavigationMenuLink>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                            <li className='row-span-3'>
                                <NavigationMenuLink asChild href='/markets'>
                                    <div className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'>
                                        <div className='mb-2 mt-4 text-lg font-medium'>
                                            shadcn/ui
                                        </div>
                                        <p className='text-sm leading-tight text-muted-foreground'>
                                            Beautifully designed components that
                                            you can copy and paste into your
                                            apps. Accessible. Customizable. Open
                                            Source.
                                        </p>
                                    </div>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href='/docs' title='Introduction'>
                                Re-usable components built using Radix UI and
                                Tailwind CSS.
                            </ListItem>
                            <ListItem
                                href='/docs/installation'
                                title='Installation'
                            >
                                How to install dependencies and structure your
                                app.
                            </ListItem>
                            <ListItem
                                href='/docs/primitives/typography'
                                title='Typography'
                            >
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        href='/election'
                    >
                        <div>
                            <Flag width={15} height={15} />
                        </div>
                        Election
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        href='/activity'
                    >
                        <div>
                            <Activity width={15} height={15} />
                        </div>
                        Activity
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        href='/ranks'
                    >
                        <div>
                            <Trophy width={15} height={15} />
                        </div>
                        Ranks
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
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
