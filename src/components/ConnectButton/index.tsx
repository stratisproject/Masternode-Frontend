import { useAccount } from 'wagmi'
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from '@web3auth/modal/react'

import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'

const ConnectButton = () => {
  const { address } = useAccount()
  const { connect, isConnected } = useWeb3AuthConnect()

  const { disconnect } = useWeb3AuthDisconnect()
  const dispatch = useAppDispatch()

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
      onClick={connect}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectButton
