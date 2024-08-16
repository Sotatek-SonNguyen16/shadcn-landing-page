import { LogoIcon } from '@/components/Icons.tsx'
import { MarketsNavigateMenu } from '@/components/layout/NavigateMenu.tsx'
import SearchBar from '@/components/layout/SearchBar.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { Button, buttonVariants } from '@/components/ui/button.tsx'
import {
    NavigationMenu,
    NavigationMenuItem
} from '@/components/ui/navigation-menu'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { clsx } from 'clsx'
import { Activity, Flag, Grip, Menu, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

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
    const { isLogin, handleLogin, handleLogout, address } = useAuthContext()

    return (
        <header
            className={clsx(
                'sticky border-b-[1px] top-0 z-40 bg-white h-auto lg:h-[117px]',
                'dark:border-b-slate-700 dark:bg-background'
            )}
        >
            <NavigationMenu>
                <div className='h-14 w-full mx-4 md:mx-6 group flex list-none items-center justify-between space-x-1 lg:my-2'>
                    <NavigationMenuItem>
                        <a
                            rel='noreferrer noopener'
                            href='/'
                            className='font-bold text-lg flex gap-1 text-nowrap items-center'
                        >
                            <LogoIcon />
                            Prediction Market
                        </a>
                    </NavigationMenuItem>

                    {/* mobile */}
                    <div className='flex lg:hidden items-center gap-2'>
                        <div className='w-full flex justify-center'>
                            {!isLogin ? (
                                <Button
                                    className='rounded-2xl'
                                    variant={'primary'}
                                    onClick={handleLogin}
                                >
                                    Connect
                                </Button>
                            ) : (
                                <Button
                                    variant={'default'}
                                    className='w-[100px] rounded-2xl'
                                >
                                    <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                        {address}
                                    </span>
                                </Button>
                            )}
                        </div>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger>
                                <Menu
                                    className='flex lg:hidden h-5 w-5'
                                    onClick={() => setIsOpen(true)}
                                >
                                    <span className='sr-only'>Menu Icon</span>
                                </Menu>
                            </SheetTrigger>

                            <SheetContent
                                side={'left'}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SheetHeader>
                                    <SheetTitle className='font-bold text-lg'>
                                        Prediction Market
                                    </SheetTitle>
                                    <SheetDescription></SheetDescription>
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
                                    {address && (
                                        <Button
                                            variant={'destructive'}
                                            onClick={handleLogout}
                                        >
                                            Disconnect
                                        </Button>
                                    )}
                                    <ModeToggle />
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* desktop */}
                    <div className='hidden lg:block w-full px-4'>
                        <SearchBar />
                    </div>
                    <div className='hidden lg:block px-4'>
                        <MarketsNavigateMenu />
                    </div>

                    <div className='hidden lg:flex gap-2 items-center'>
                        {!isLogin ? (
                            <div className='w-full flex justify-center'>
                                <Button
                                    variant={'primary'}
                                    onClick={handleLogin}
                                >
                                    Connect Wallet
                                </Button>
                            </div>
                        ) : (
                            <div className='w-full flex justify-center'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant={'default'}
                                            className='w-[130px]'
                                        >
                                            <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                                {address}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            <span className='text-destructive'>
                                                Disconnect
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </NavigationMenu>
        </header>
    )
}
