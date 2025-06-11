import { useCallback } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

import { useAppDispatch, useAppSelector } from 'state'
import { ChainId } from 'web3/chains'
import { CHAINS } from 'web3/chains'
import { setSiteNetworkId } from './reducer'

export function useSiteNetworkId() {
  return useAppSelector(state => state.network.siteNetworkId)
}

export function useActiveChainId() {
  const chainId = useChainId()
  const siteNetworkId = useSiteNetworkId()

  // Only update from wallet chain if connected and we don't have a site network ID
  if (siteNetworkId) {
    return siteNetworkId
  }

  // Return the site's selected network
  return chainId as ChainId
}

export function useActiveNetwork() {
  const chainId = useActiveChainId()
  return CHAINS[chainId]
}

export function useSwitchNetwork() {
  const { switchChain } = useSwitchChain()
  const { address } = useAccount()
  const dispatch = useAppDispatch()
  const chainId = useActiveChainId()

  return useCallback(
    async (newChainId: ChainId) => {
      try {
        // Always update the site network ID first
        dispatch(setSiteNetworkId(newChainId))

        await switchChain({ chainId: newChainId })
      } catch (error) {
        console.error('Failed to switch network', error)
        // If switch fails, revert to current chain
        dispatch(setSiteNetworkId(chainId))
      }
    },
    [
      address,
      switchChain,
      dispatch,
      chainId,
    ],
  )
}