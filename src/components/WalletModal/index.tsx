import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import ReactModal from 'react-modal'

import { Connection, ConnectionType, getConnections, networkConnection } from 'web3/connection'
import { ErrorCode } from 'web3/connection/utils'
import { isSupportedChain } from 'web3/utils'
import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'

import Option from './Option'

import styles from './styles.module.scss'

ReactModal.setAppElement('#root')

const walletModalOpen = atom(false)

function useOpenWalletModal() {
  const setWalletModalOpen = useSetAtom(walletModalOpen)
  return useCallback(() => setWalletModalOpen(true), [setWalletModalOpen])
}

function useCloseWalletModal() {
  const setWalletModalOpen = useSetAtom(walletModalOpen)
  return useCallback(() => setWalletModalOpen(false), [setWalletModalOpen])
}

export function useWalletModal() {
  const walletOpen = useAtomValue(walletModalOpen)
  return {
    walletOpen,
    openWalletModal: useOpenWalletModal(),
    closeWalletModal: useCloseWalletModal(),
  }
}

function didUserReject(connection: Connection, error: any): boolean {
  return (
    error?.code === ErrorCode.USER_REJECTED_REQUEST ||
    (connection.type === ConnectionType.WALLET_CONNECT && error?.toString?.() === ErrorCode.WC_MODAL_CLOSED) ||
    (connection.type === ConnectionType.COINBASE_WALLET && error?.toString?.() === ErrorCode.CB_REJECTED_REQUEST)
  )
}

const WalletModal = () => {
  const { walletOpen, closeWalletModal } = useWalletModal()

  const dispatch = useAppDispatch()

  const { connector, chainId } = useWeb3React()
  const [pendingConnection, setPendingConnection] = useState<Connection | undefined>()
  const [, setPendingError] = useState<any>()

  const connections = getConnections()
  // const getConnection = useGetConnection()

  useEffect(() => {
    return () => setPendingError(undefined)
  }, [setPendingError])

  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId)
    }
  }, [chainId, connector])

  const tryActivation = useCallback(async (connection: Connection) => {
    console.log(connection)
    if (connection.overrideActivate?.()) return

    try {
      setPendingConnection(connection)
      setPendingError(undefined)

      await connection.connector.activate()
      dispatch(updateSelectedWallet(connection.type))
      closeWalletModal()
      setPendingConnection(undefined)
    } catch(error: any) {
      if (didUserReject(connection, error)) {
        setPendingConnection(undefined)
      } else if (error?.code !== ErrorCode.MM_ALREADY_PENDING) {
        console.debug(`web3-react conection error: ${error}`)
        setPendingError(error.message)
      }
    }
  }, [dispatch, setPendingError])

  return (
    <ReactModal
      isOpen={ walletOpen }
      className={styles['modal-content']}
      overlayClassName={styles['modal-overlay']}
      bodyOpenClassName={styles['modal-open']}
    >
      <div className={styles.body}>
        <div className={styles.header}>
          Connect wallet
        </div>
        <div className={styles['wallets-grid']}>
          {connections.filter(c => c.shouldDisplay()).map(connection => (
            <Option
              key={connection.getName()}
              connection={connection}
              activate={() => tryActivation(connection)}
              pendingConnectionType={pendingConnection?.type}
            />
          ))}
        </div>
      </div>
    </ReactModal>
  )
}

export default WalletModal
