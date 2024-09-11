import React from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Wallet } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { truncateString } from '@/lib/utils.ts'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import WalletInfoDrawer from '@/views/v2/home/WalletInfoDrawer.tsx'

const WalletButton: React.FC = () => {
    const { address, isLogin, handleLogin } = useAuthContext()
    const { openDrawer } = useDrawerContext()
    const onClickConnectButton = () => {
        if (!isLogin) {
            handleLogin().then()
        } else {
            openDrawer({
                background: 'bg-color-neutral-50',
                content: <WalletInfoDrawer />
            })
        }
    }

    return (
        <Button
            variant={'transparent'}
            size={'iconGroup'}
            onClick={onClickConnectButton}
        >
            <Wallet size={16} color='#FFFFFF80' />
            {isLogin ? (
                <div className='self-stretch text-white text-xs font-normal'>
                    {truncateString(address, 20, 3, 3)}
                </div>
            ) : (
                <div className='text-center text-color-neutral-900 text-sm font-semibold leading-tight'>
                    Connect Wallet
                </div>
            )}
        </Button>
    )
}

export default WalletButton
