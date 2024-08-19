import {
    ConnectedWallet,
    TonConnectError,
    TonConnectUI
} from '@tonconnect/ui-react'
import axios from 'axios'

export default class TonConnectProvider {
    private static tonConnectUI: TonConnectUI

    static setTonConnectUI(tonConnectUI: TonConnectUI) {
        if (TonConnectProvider.tonConnectUI) {
            return
        }

        TonConnectProvider.tonConnectUI = tonConnectUI
        tonConnectUI.onStatusChange(
            (wallet: ConnectedWallet | null) => {
                if (!wallet) {
                    delete axios.defaults.headers.common['x-address']
                }
                axios.defaults.headers.common['x-address'] =
                    wallet?.account.address
            },
            (err: TonConnectError) => {
                console.log('TonConnectError: ', err)
            }
        )
    }

    static getTonConnectUI() {
        return TonConnectProvider.tonConnectUI
    }
}
