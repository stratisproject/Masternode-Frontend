import React from 'react'
import { useWeb3Auth } from '@web3auth/modal/react'
import { useChainId } from 'wagmi'

const NetworkBadge: React.FC = () => {
  // Triggers rerender on network switch
  useChainId()
  const { web3Auth } = useWeb3Auth()

  if (!web3Auth?.currentChain) {
    return null
  }

  const badgeClasses = web3Auth.currentChain.isTestnet
    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    : 'bg-green-500/10 text-green-500 border border-green-500/20'

  return (
    <div className={`ml-2 py-1 px-2 rounded-md text-xs font-medium ${badgeClasses}`}>
      {web3Auth.currentChain.isTestnet ? 'Testnet' : 'Mainnet'}
    </div>
  )
}

export default NetworkBadge