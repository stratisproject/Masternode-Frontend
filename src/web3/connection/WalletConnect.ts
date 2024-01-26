import { WalletConnect as WalletConnectV2, WalletConnectConstructorArgs } from '@web3-react/walletconnect-v2'
import { ChainId } from 'web3/chains'

export class WalletConnectPopup extends WalletConnectV2 {
  constructor({ actions, onError, showQrModal = true }: Omit<WalletConnectConstructorArgs, 'options'> & { showQrModal?: boolean }) {
    super({
      actions,
      options: {
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
        chains: [ChainId.STRATIS],
        optionalChains: [ChainId.AURORIA],
        showQrModal,
      },
      onError,
    })
  }
}