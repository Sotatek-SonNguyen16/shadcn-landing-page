import { LogoIcon } from '@/components/Icons.tsx'
import { MarketsNavigateMenu } from '@/components/layout/NavigateMenu.tsx'
import SearchBar from '@/components/layout/SearchBar.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { buttonVariants } from '@/components/ui/button.tsx'
import {
    NavigationMenu,
    NavigationMenuItem
} from '@/components/ui/navigation-menu'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { TonConnectButton } from '@tonconnect/ui-react'
import { clsx } from 'clsx'
import { Activity, Flag, Grip, Menu, Trophy } from 'lucide-react'
import { useState } from 'react'

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
    const { isLogin, handleLogin, handleLogout } = useAuthContext()
    const [isOpen, setIsOpen] = useState<boolean>(false)
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
                    <span className='flex lg:hidden'>
                        <ModeToggle />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger>
                                <Menu
                                    className='flex lg:hidden h-5 w-5'
                                    onClick={() => setIsOpen(true)}
                                >
                                    <span className='sr-only'>Menu Icon</span>
                                </Menu>
                            </SheetTrigger>

                            <SheetContent side={'left'}>
                                <SheetHeader>
                                    <SheetTitle className='font-bold text-lg'>
                                        Prediction Market
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
                                    {!isLogin ? (
                                        <>
                                            <div
                                                className={`w-[110px] border ${buttonVariants(
                                                    {
                                                        variant: 'secondary'
                                                    }
                                                )}`}
                                                onClick={handleLogin}
                                            >
                                                Login
                                            </div>
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
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={`w-[110px] border ${buttonVariants(
                                                    {
                                                        variant: 'outline'
                                                    }
                                                )}`}
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </div>
                                        </>
                                    )}
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

                    <div className='hidden lg:flex gap-2 items-center'>
                        {!isLogin ? (
                            <>
                                <div
                                    className={`w-[110px] border ${buttonVariants(
                                        {
                                            variant: 'secondary'
                                        }
                                    )}`}
                                    onClick={handleLogin}
                                >
                                    Login
                                </div>
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
                            </>
                        ) : (
                            <>
                                <div
                                    className={`w-[110px] border ${buttonVariants(
                                        {
                                            variant: 'outline'
                                        }
                                    )}`}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </div>
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </NavigationMenu>

            <TonConnectButton />
        </header>
    )
}
