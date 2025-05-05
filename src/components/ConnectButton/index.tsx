import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect, useChainId } from 'wagmi'
import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'
import { useEffect } from 'react'
import { ConnectionType } from 'web3/connection'
import { networkConnection } from 'web3/connection'
import { isSupportedChain } from 'web3/utils'
import {
  useUpdateBalance,
  useUpdateRewards,
  useUpdateRegistrationStatus,
  useUpdateLastClaimedBlock,
  useUpdateType,
  useUpdateBlockShares,
  useUpdateTotalSeconds,
} from 'state/user/hooks'

//import styles from './styles.module.scss'

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const dispatch = useAppDispatch()

  // Import all update hooks
  const updateBalance = useUpdateBalance()
  const updateRewards = useUpdateRewards()
  const updateRegistrationStatus = useUpdateRegistrationStatus()
  const updateLastClaimedBlock = useUpdateLastClaimedBlock()
  const updateType = useUpdateType()
  const updateBlockShares = useUpdateBlockShares()
  const updateTotalSeconds = useUpdateTotalSeconds()

  useEffect(() => {
    if (isConnected && address) {
      dispatch(updateSelectedWallet(ConnectionType.INJECTED))

      // Update all user data
      updateBalance()
      updateRewards()
      updateRegistrationStatus()
      updateLastClaimedBlock()
      updateType()
      updateBlockShares()
      updateTotalSeconds()
    }
  }, [
    isConnected,
    address,
    dispatch,
    updateBalance,
    updateRewards,
    updateRegistrationStatus,
    updateLastClaimedBlock,
    updateType,
    updateBlockShares,
    updateTotalSeconds,
  ])

  useEffect(() => {
    if (chainId && isSupportedChain(chainId)) {
      // Ensure network connection is activated for the current chain
      networkConnection.connector.activate(chainId)
    }
  }, [chainId])

  const handleDisconnect = () => {
    disconnect()
    dispatch(updateSelectedWallet(undefined))
  }

  if (isConnected) {
    return (
      <button
        className="flex gap-2 pointer-events-auto rounded-md bg-purple-900 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
        onClick={handleDisconnect}
      >
        <div className='text-ellipsis overflow-hidden max-w-32' title={address}>
          {address}
        </div>
      </button>
    )
  }

  return (
    <button
      className="flex gap-2 pointer-events-auto rounded-md bg-purple-900 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
      onClick={openConnectModal}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectButton
