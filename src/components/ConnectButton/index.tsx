import { useState } from 'react'
import { useAccount } from 'wagmi'
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useManageMFA,
  useEnableMFA,
  useWeb3AuthUser,
} from '@web3auth/modal/react'
import { WALLET_CONNECTORS } from '@web3auth/no-modal'

import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'

import styles from './styles.module.scss'

const ConnectButton = () => {
  const { address } = useAccount()
  const { connect, isConnected } = useWeb3AuthConnect()
  const { enableMFA } = useEnableMFA()
  const { manageMFA } = useManageMFA()
  const { isMFAEnabled } = useWeb3AuthUser()
  const { web3Auth } = useWeb3Auth()
  const { disconnect } = useWeb3AuthDisconnect()
  const dispatch = useAppDispatch()
  const [showMenu, setShowMenu] = useState(false)

  const handleManageMFA = () => {
    isMFAEnabled ? manageMFA() : enableMFA()
    setShowMenu(false)
  }

  const handleDisconnect = () => {
    disconnect()
    dispatch(updateSelectedWallet(undefined))
    setShowMenu(false)
  }

  if (isConnected) {
    return (
      <div className={styles.account}>
        <button
          className="flex gap-2 pointer-events-auto rounded-md bg-purple-900 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className='text-ellipsis overflow-hidden max-w-32' title={address}>
            {address}
          </div>
        </button>
        {showMenu ? (
          <div className={styles.menu}>
            {web3Auth?.connectedConnector?.name === WALLET_CONNECTORS.AUTH ? (
              <button className={styles.option}  onClick={handleManageMFA}>
                Manage MFA
              </button>
            ) : null}
            <button className={styles.option} onClick={handleDisconnect}>
            Disconnect
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <button
      className="flex gap-2 pointer-events-auto rounded-md bg-purple-900 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
      onClick={() => connect()}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectButton
