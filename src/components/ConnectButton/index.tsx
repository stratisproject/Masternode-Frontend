import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useAppDispatch } from 'state'
import { useGetConnection } from 'web3/connection'
import { updateSelectedWallet } from 'state/wallet/reducer'

import { useWalletModal } from 'components/WalletModal'

import styles from './styles.module.scss'

const ConnectButton = () => {
  const { openWalletModal } = useWalletModal()
  const { account, connector } = useWeb3React()
  const dispatch = useAppDispatch()

  const getConnection = useGetConnection()

  const connection = getConnection(connector)

  const connected = !!account

  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate()
    }

    connector.resetState()
    dispatch(updateSelectedWallet(undefined))
  }, [connector, dispatch])

  if (connected) {
    return (
      <button className={styles.button} onClick={disconnect}>
        <div>
          {account}
        </div>
        <img width="20px" height="20px" src={connection.getIcon()} alt={connection.getName()} />
      </button>
    )
  }

  return (
    <button className={styles.button} onClick={openWalletModal}>
      Connect Wallet
    </button>
  )
}

export default ConnectButton
