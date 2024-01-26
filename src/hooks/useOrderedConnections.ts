import { useMemo } from 'react'

import { ConnectionType, useGetConnection } from 'web3/connection'
import { useSelectedWallet } from 'state/wallet/hooks'

const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.WALLET_CONNECT,
  ConnectionType.COINBASE_WALLET,
]

export default function useOrderedConnections() {
  const selectedWallet = useSelectedWallet()
  const getConnection = useGetConnection()

  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = []

    orderedConnectionTypes.push(ConnectionType.GNOSIS_SAFE)

    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter(wallet => wallet !== selectedWallet))

    orderedConnectionTypes.push(ConnectionType.NETWORK)

    return orderedConnectionTypes.map(connectionType => getConnection(connectionType))
  }, [getConnection, selectedWallet])
}
