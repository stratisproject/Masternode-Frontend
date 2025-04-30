import { useActiveNetwork } from 'state/network/hooks'
import React from 'react'

const NetworkBadge: React.FC = () => {
  const activeNetwork = useActiveNetwork()

  if (!activeNetwork) {
    return null
  }

  const badgeClasses = activeNetwork.testnet
    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    : 'bg-green-500/10 text-green-500 border border-green-500/20'

  return (
    <div className={`ml-2 py-1 px-2 rounded-md text-xs font-medium ${badgeClasses}`}>
      {activeNetwork.testnet ? 'Testnet' : 'Mainnet'}
    </div>
  )
}

export default NetworkBadge