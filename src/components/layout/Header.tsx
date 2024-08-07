import { useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from '@/components/ui/navigation-menu'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { Activity, Flag, Grip, Menu, Trophy } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { LogoIcon } from '@/components/Icons.tsx'
import { MarketsNavigateMenu } from '@/components/layout/NavigateMenu.tsx'
import SearchBar from '@/components/layout/SearchBar.tsx'

interface RouteProps {
    icon: JSX.Element
    href: string
    label: string
}

const routeList: RouteProps[] = [
    {
        icon: <Grip width={15} height={15} />,
        href: '/markets',
        label: 'Markets'
    },
    {
        icon: <Flag width={15} height={15} />,
        href: '/election',
        label: 'Election'
    },
    {
        icon: <Activity width={15} height={15} />,
        href: '/activity',
        label: 'Activity'
    },
    {
        icon: <Trophy width={15} height={15} />,
        href: '/ranks',
        label: 'Ranks'
    }
]

export const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <header className='sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background h-[117px]'>
            <NavigationMenu className='mx-auto'>
                <NavigationMenuList className='container h-14 w-screen flex justify-between '>
                    <NavigationMenuItem className='font-bold flex'>
                        <a
                            rel='noreferrer noopener'
                            href='/'
                            className='ml-2 font-bold text-xl flex'
                        >
                            <LogoIcon />
                            PredictionMarket
                        </a>
                    </NavigationMenuItem>

                    {/* mobile */}
                    <span className='flex lg:hidden'>
                        <ModeToggle />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger className='px-2'>
                                <Menu
                                    className='flex lg:hidden h-5 w-5'
                                    onClick={() => setIsOpen(true)}
                                >
                                    <span className='sr-only'>Menu Icon</span>
                                </Menu>
                            </SheetTrigger>

                            <SheetContent side={'left'}>
                                <SheetHeader>
                                    <SheetTitle className='font-bold text-xl'>
                                        PredictionMarket
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className='flex flex-col justify-center items-center gap-2 mt-4'>
                                    {routeList.map(
                                        ({ href, label }: RouteProps) => (
                                            <a
                                                rel='noreferrer noopener'
                                                key={label}
                                                href={href}
                                                onClick={() => setIsOpen(false)}
                                                className={buttonVariants({
                                                    variant: 'ghost'
                                                })}
                                            >
                                                {label}
                                            </a>
                                        )
                                    )}
                                    <a
                                        rel='noreferrer noopener'
                                        href='#'
                                        target='_blank'
                                        className={`w-[110px] border ${buttonVariants(
                                            {
                                                variant: 'secondary'
                                            }
                                        )}`}
                                    >
                                        Login
                                    </a>
                                    <a
                                        rel='noreferrer noopener'
                                        href='#'
                                        target='_blank'
                                        className={`w-[110px] border ${buttonVariants(
                                            {
                                                variant: 'primary'
                                            }
                                        )}`}
                                    >
                                        Sign Up
                                    </a>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </span>

                    {/* desktop */}
                    <div className='hidden lg:block w-full px-4'>
                        <SearchBar />
                    </div>
                    <div className='hidden lg:block px-4'>
                        <MarketsNavigateMenu />
                    </div>

                    <div className='hidden lg:flex gap-2'>
                        <a
                            rel='noreferrer noopener'
                            href='#'
                            target='_blank'
                            className={`border ${buttonVariants({ variant: 'secondary' })}`}
                        >
                            Login
                        </a>
                        <a
                            rel='noreferrer noopener'
                            href='#'
                            target='_blank'
                            className={`border ${buttonVariants({ variant: 'primary' })}`}
                        >
                            Sign Up
                        </a>
                        <ModeToggle />
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}
