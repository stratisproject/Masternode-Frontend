import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useAppDispatch, useAppSelector } from 'state'
import { ChainId, getAddChainParameters, CHAINS } from 'web3/chains'
import { networkConnection } from 'web3/connection'
import { isSupportedChain } from 'web3/utils'

import { setSiteNetworkId } from './reducer'

export function useSiteNetworkId() {
  return useAppSelector(state => state.network.siteNetworkId)
}

export function useActiveChainId() {
  const { chainId, isActive } = useWeb3React()
  const siteNetworkId = useSiteNetworkId()

  if (!isActive) {
    return siteNetworkId
  }

  return chainId as ChainId
}

export function useFallbackChainId() {
  const { chainId, isActive } = useWeb3React()
  const siteNetworkId = useAppSelector(state => state.network.siteNetworkId)

  if (!isActive || !isSupportedChain(chainId)) {
    return siteNetworkId
  }

  return chainId as ChainId
}

export function useActiveNetwork() {
  const chainId = useActiveChainId()

  return (chainId && isSupportedChain(chainId)) ? CHAINS[chainId] : undefined
}

export function useSwitchNetwork() {
  const dispatch = useAppDispatch()
  const { connector, account } = useWeb3React()

  return useCallback(async (chainId: ChainId) => {
    if (!account) {
      await networkConnection.connector.activate(chainId)
    } else {
      await connector.activate(getAddChainParameters(chainId))
    }

    if (isSupportedChain(chainId)) {
      dispatch(setSiteNetworkId(chainId))
    }
  }, [dispatch, account, connector])
}
