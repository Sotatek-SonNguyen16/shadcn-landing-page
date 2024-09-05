import React, { Fragment, useMemo, useState } from 'react'
import { clsx } from 'clsx'
import {
    Activity,
    Copy,
    ExternalLink,
    Eye,
    EyeOff,
    MoveRight,
    TrendingUp
} from 'lucide-react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import {
    ProfileProvider,
    useProfileContext
} from '@/contexts/ProfileContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { formatUnixTime, truncateString } from '@/lib/utils.ts'
import useCopyToClipboard from '@/hooks/useCopyToClipboard.ts'
import { Button } from '@/components/ui/button.tsx'
import {
    BrandMask,
    ChartIcon,
    DepositeIcon,
    TradeIcon,
    WithdrawIcon
} from '@/components/icon.tsx'
import { ITrade } from '@/types'
import HistoryDrawer from '@/views/v2/portfolio/HistoryDrawer.tsx'
import useTelegram from '@/hooks/useTelegram.ts'
import { useNavigate } from 'react-router-dom'

const ProfileTitle = () => {
    const { address, isLogin } = useAuthContext()
    const { copyToClipboard } = useCopyToClipboard()
    const { user } = useTelegram()

    return (
        <div className='rounded-lg justify-start items-center gap-2 inline-flex mx-4'>
            <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                <div className='self-stretch text-color-neutral-900 text-2xl font-semibold leading-loose'>
                    Profile
                </div>
            </div>
            <div className='px-2.5 py-1 bg-color-neutral-50 rounded-md justify-center items-center gap-1 flex'>
                <div className='rounded-lg justify-center items-center gap-1 flex'>
                    {user && (
                        <Avatar className='relative inline-flex h-8 w-8'>
                            <AvatarImage
                                src={user?.photo_url ?? ''}
                                className='h-full w-full object-cover rounded-full'
                            />
                            <AvatarFallback className='flex h-full w-full items-center justify-center bg-color-neutral-250 rounded-full'>
                                {user?.first_name && user.last_name
                                    ? user?.first_name[0] + user?.last_name[0]
                                    : ''}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
                <div className='pr-2 pb-0.5 rounded-lg flex-col justify-center items-center inline-flex'>
                    {isLogin ? (
                        <div className='self-stretch text-center text-color-neutral-900 text-xs font-normal leading-none'>
                            {truncateString(address, 20, 3, 3)}
                        </div>
                    ) : (
                        <div className='text-center text-color-neutral-900 text-sm font-semibold leading-tight'>
                            Connect Wallet
                        </div>
                    )}
                </div>
                <Copy
                    size={16}
                    className='cursor-pointer'
                    onClick={() => copyToClipboard(address)}
                />
            </div>
        </div>
    )
}

const BalanceCard = () => {
    const [showBalance, setShowBalance] = useState<boolean>(false)

    const onToggleBalance = () => {
        setShowBalance((prevState) => !prevState)
    }

    return (
        <div className='mx-4 p-4 bg-gradient-to-r from-[#D8E881] to-[#E4FE34] rounded-2xl flex-col justify-center items-start gap-6 inline-flex relative overflow-hidden'>
            <div className='absolute overflow-hidden right-[-100px]'>
                <BrandMask />
            </div>
            <div className='self-stretch h-16 rounded-lg flex-col justify-center items-start gap-2 flex'>
                <div className='self-stretch h-5 rounded-lg justify-start items-center gap-2 inline-flex'>
                    <div className='rounded-lg justify-start items-center gap-0.5 flex'>
                        <div className='text-color-neutral-alpha-900 text-xs font-normal leading-none'>
                            My balance
                        </div>
                        <div className='text-color-neutral-alpha-500 text-xs font-normal leading-none'>
                            /Total cash
                        </div>
                    </div>
                    <div
                        className='rounded-lg justify-center items-center flex cursor-pointer'
                        onClick={onToggleBalance}
                    >
                        {showBalance ? (
                            <Eye
                                size={16}
                                className='text-color-neutral-alpha-500'
                            />
                        ) : (
                            <EyeOff
                                size={16}
                                className='text-color-neutral-alpha-500'
                            />
                        )}
                    </div>
                </div>
                <div className='self-stretch rounded-lg justify-start items-center gap-1 inline-flex'>
                    <div className='text-color-neutral-alpha-900 text-3xl font-light leading-10'>
                        $
                    </div>
                    <div className='text-color-neutral-alpha-900 text-4xl font-normal leading-10'>
                        15,007
                    </div>
                    <div className='text-color-neutral-alpha-500 text-4xl font-normal leading-10'>
                        .99
                    </div>
                </div>
            </div>
            <div className='self-stretch rounded-lg justify-start items-center gap-2 grid grid-cols-2'>
                <Button variant='default' size='iconGroupLg'>
                    <WithdrawIcon />
                    <div className='pb-0.5 rounded-lg flex-col justify-center items-center inline-flex'>
                        <div className='self-stretch text-center text-color-neutral-alpha-900 text-sm font-semibold leading-tight'>
                            Withdraw
                        </div>
                    </div>
                </Button>
                <Button variant='outline' size='iconGroupLg'>
                    <DepositeIcon />
                    <div className='pb-0.5 rounded-lg flex-col justify-center items-center inline-flex'>
                        <div className='self-stretch text-center text-color-brand-500 text-sm font-semibold leading-tight'>
                            Deposite
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    )
}

const ProfileAnalyze = () => {
    const analytics = useMemo(
        () => [
            {
                icon: <Activity size={20} className='text-color-neutral-500' />,
                name: 'Position value',
                value: 32.88
            },
            {
                icon: (
                    <TrendingUp size={20} className='text-color-neutral-500' />
                ),
                name: 'Profit/loss',
                value: 32.88
            },
            { icon: <ChartIcon />, name: 'Volume traded', value: 32.88 },
            { icon: <TradeIcon />, name: 'Markets traded', value: 32.88 }
        ],
        []
    )

    return (
        <div className='mx-4 grid grid-cols-2'>
            {analytics.map((als, index) => (
                <div
                    key={index}
                    className='h-16 p-4 border-r border-b border-color-neutral-50 justify-start items-center gap-2 inline-flex'
                >
                    <div className='p-1.5 bg-color-neutral-50 rounded-lg justify-center items-center flex'>
                        {als.icon}
                    </div>
                    <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                            ${als.value}
                        </div>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                            {als.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const HistoryListItem = ({ trade }: { trade: ITrade }) => {
    const navigate = useNavigate()

    const goToDetailEvent = (id: string) => {
        navigate(`/v2/event/${id}`)
    }

    return (
        <div className='w-full rounded-xl bg-color-neutral-50 flex flex-col p-3 gap-3'>
            <div className='w-full rounded-lg justify-start items-center gap-3 inline-flex'>
                <div className='relative'>
                    <div className='size-12 rounded-[0.375rem] opacity-100'>
                        <img
                            src={trade?.image}
                            alt={trade?.name}
                            className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[0.375rem]'
                        />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-start items-start inline-flex'>
                    <div
                        className='self-stretch min-h-6 rounded-lg flex-col justify-center items-start flex cursor-pointer'
                        onClick={() => goToDetailEvent(trade.eventId)}
                    >
                        <div className='w-[calc(100vw-132px)] text-color-neutral-900 text-sm font-normal leading-tight text-wrap'>
                            {trade?.name}
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-8 rounded-lg justify-start items-center gap-2 inline-flex'>
                <div className='grow shrink basis-0 rounded-lg flex-col justify-start items-start gap-0.5 inline-flex'>
                    <div className='self-stretch rounded-lg justify-start items-center gap-1 inline-flex'>
                        <div className='text-color-neutral-900 text-sm font-light leading-tight capitalize'>
                            {trade?.type?.toLowerCase()}
                        </div>
                        <div
                            className={`grow shrink basis-0  text-sm font-light leading-tight ${
                                trade?.positionType === 'YES'
                                    ? 'text-color-accent-green-900'
                                    : 'text-color-accent-red-900'
                            }`}
                        >
                            {trade?.positionType}
                        </div>
                    </div>
                    <div className='self-stretch rounded-lg justify-start items-center gap-0.5 inline-flex'>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            {trade?.shares}{' '}
                        </div>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            shares at
                        </div>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            {trade?.price}¢
                        </div>
                    </div>
                </div>
                <div className='rounded-lg flex-col justify-center items-end gap-0.5 inline-flex'>
                    <div className='self-stretch h-5 rounded-lg flex-col justify-center items-end flex'>
                        <div className='self-stretch text-right text-color-neutral-900 text-sm font-normal leading-tight'>
                            ${trade?.totalValue}
                        </div>
                    </div>
                    <div className='self-stretch rounded-lg justify-end items-center gap-0.5 inline-flex'>
                        <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                                {formatUnixTime(trade?.timestamp)}
                            </div>
                        </div>
                        <div className='rounded-lg justify-center items-center flex cursor-pointer'>
                            <ExternalLink
                                size={12}
                                className='text-color-brand-500'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const RecentActivities = () => {
    const { tradesHistory } = useProfileContext()
    const { openDrawer } = useDrawerContext()

    const onClickViewAll = () => {
        openDrawer({
            background: '',
            content: <HistoryDrawer />
        })
    }

    return (
        <div className='min-w-[200px] h-[90vh] w-full p-4 bg-color-neutral-alpha-900 rounded-tl-2xl rounded-tr-2xl border-t border-color-neutral-50 flex flex-col gap-4'>
            <div className='w-full rounded-lg justify-start items-center gap-4 inline-flex'>
                <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start gap-1 inline-flex'>
                    <div className='self-stretch text-color-neutral-900 text-base font-semibold leading-normal'>
                        Recent activities
                    </div>
                </div>
                <div
                    className='justify-center items-center gap-1 flex cursor-pointer'
                    onClick={onClickViewAll}
                >
                    <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight'>
                            View All
                        </div>
                    </div>
                    <MoveRight size={16} className='text-color-brand-500' />
                </div>
            </div>
            <div className='overflow-auto scrollbar-hidden'>
                <div className='flex flex-col gap-4'>
                    {tradesHistory?.map((trade: ITrade, index: number) => (
                        <Fragment key={index}>
                            <HistoryListItem trade={trade} />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ProfilePage: React.FC = () => {
    return (
        <ProfileProvider>
            <div
                className={clsx(
                    'bg-background',
                    'w-full flex flex-col',
                    'pt-4 gap-4'
                )}
            >
                <ProfileTitle />
                <BalanceCard />
                <ProfileAnalyze />
                <DrawerProvider>
                    <RecentActivities />
                </DrawerProvider>
            </div>
        </ProfileProvider>
    )
}

export default ProfilePage
