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
  const dispatch = useAppDispatch()
  const chainId = useActiveChainId()

  return useCallback(
    async (newChainId: ChainId) => {
      if (!address) return
      try {
        await switchChain({ chainId: Number(newChainId) })
        // Update state after successful network switch
        dispatch(setSiteNetworkId(newChainId))
      } catch (error) {
        console.error('Failed to switch network', error)
        // If switch fails, revert to current chain
        dispatch(setSiteNetworkId(chainId))
      }
    },
    [address, switchChain, dispatch, chainId],
  )
}
