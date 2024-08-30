import React from 'react'
import { Button } from '@/components/ui/button.tsx'
import useCopyToClipboard from '@/hooks/useCopyToClipboard.ts'
import { Copy, LogOut } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { truncateString } from '@/lib/utils.ts'
import { TonIcon } from '@/components/icon.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'

const WalletInfoDrawer: React.FC = () => {
    const { isCopied, copyToClipboard } = useCopyToClipboard()
    const { handleLogout, address } = useAuthContext()
    const { closeDrawer } = useDrawerContext()

    return (
        <div className='w-full px-4 flex flex-col gap-2'>
            <div className='text-color-neutral-900 text-base font-semibold leading-normal'>
                Your Wallet
            </div>
            <div className='flex items-center p-2 bg-color-neutral-100 rounded-lg justify-start gap-2'>
                <TonIcon />
                <div>
                    <div className='text-color-neutral-900 text-base font-normal leading-normal'>
                        {' '}
                        {truncateString(address, 20, 3, 3)}
                    </div>
                    <div className='text-color-neutral-500 text-xs font-light leading-none'>
                        The Open Network
                    </div>
                </div>
            </div>
            <div className='w-full py-2 flex-col justify-end items-center inline-flex'>
                <div className='self-stretch h-[1px] border-[1px] border-dashed border-color-neutral-100'></div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <Button
                    variant={'accentGhost'}
                    size={'iconGroupLg'}
                    onClick={async () => {
                        closeDrawer()
                        await handleLogout()
                    }}
                >
                    <LogOut size={20} />{' '}
                    <span className='text-sm font-semibold leading-tight'>
                        Disconnect
                    </span>
                </Button>
                <Button
                    variant={'default'}
                    size={'iconGroupLg'}
                    onClick={() => copyToClipboard(address)}
                >
                    <Copy size={20} />{' '}
                    <span className='text-sm font-semibold leading-tight'>
                        {isCopied ? 'Copied' : 'Copy'}
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default WalletInfoDrawer
