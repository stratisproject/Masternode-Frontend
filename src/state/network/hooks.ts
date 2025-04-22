import { useCallback } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

import { useAppDispatch } from 'state'
import { ChainId } from 'web3/chains'
import { CHAINS } from 'web3/chains'
import { setSiteNetworkId } from './reducer'

export function useActiveChainId() {
  const chainId = useChainId()
  const dispatch = useAppDispatch()

  if (chainId) {
    dispatch(setSiteNetworkId(chainId as ChainId))
  }

  return chainId as ChainId
}

export function useActiveNetwork() {
  const chainId = useActiveChainId()
  return chainId ? CHAINS[chainId] : undefined
}

export function useSwitchNetwork() {
  const { switchChain } = useSwitchChain()
  const { address } = useAccount()

  return useCallback(
    async (chainId: ChainId) => {
      if (!address) return
      try {
        await switchChain({ chainId })
      } catch (error) {
        console.error('Failed to switch network', error)
      }
    },
    [address, switchChain],
  )
}
