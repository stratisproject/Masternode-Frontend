import { useEffect } from 'react'

import { Connector } from '@web3-react/types'

import {
  Connection,
  gnosisSafeConnection,
  networkConnection,
  useGetConnection,
} from 'web3/connection'

import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'
import { useSelectedWallet } from 'state/wallet/hooks'
import { useSiteNetworkId } from 'state/network/hooks'
import { ChainId } from 'web3/chains'

async function connect(connector: Connector, chainId?: ChainId) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate(chainId)
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()

  const getConnection = useGetConnection()
  const selectedWallet = useSelectedWallet()
  const siteNetworkId = useSiteNetworkId()

  let selectedConnection: Connection | undefined
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet)
    } catch {
      dispatch(updateSelectedWallet(undefined))
    }
  }

  useEffect(() => {
    connect(gnosisSafeConnection.connector)
    connect(networkConnection.connector, siteNetworkId)

    if (selectedConnection) {
      connect(selectedConnection.connector)
    }
  }, [])
}
