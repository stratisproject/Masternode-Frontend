import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
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
      onClick={openConnectModal}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectButton
