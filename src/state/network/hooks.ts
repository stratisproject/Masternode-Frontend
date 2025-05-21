import { useCallback } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

import { useAppDispatch, useAppSelector } from 'state'
import { ChainId } from 'web3/chains'
import { CHAINS } from 'web3/chains'
import { setSiteNetworkId } from './reducer'

import {
  useUpdateContractBalance,
  useUpdateTotalBlockShares,
  useUpdateTotalCollateralAmount,
  useUpdateTotalRegistrations,
  useUpdateTotalTokensBalance,
} from 'state/stats/hooks'
import {
  useUpdateBalance,
  useUpdateRewards,
  useUpdateLastClaimedBlock,
  useUpdateRegistrationStatus,
  useUpdateType,
  useUpdateTotalSeconds,
} from 'state/user/hooks'

export function useActiveChainId() {
  const chainId = useChainId()
  const dispatch = useAppDispatch()
  const siteNetworkId = useAppSelector(state => state.network.siteNetworkId)

  // Only update from wallet chain if connected and we don't have a site network ID
  if (chainId && !siteNetworkId) {
    dispatch(setSiteNetworkId(chainId as ChainId))
    return chainId as ChainId
  }

  // Return the site's selected network
  return siteNetworkId
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

  const updateContractBalance = useUpdateContractBalance()
  const updateTotalRegistrations = useUpdateTotalRegistrations()
  const updateTotalBlockShares = useUpdateTotalBlockShares()
  const updateTotalCollateralAmount = useUpdateTotalCollateralAmount()
  const updateTotalTokensBalance = useUpdateTotalTokensBalance()
  const updateBalance = useUpdateBalance()
  const updateRewards = useUpdateRewards()
  const updateLastClaimedBlock = useUpdateLastClaimedBlock()
  const updateRegistrationStatus = useUpdateRegistrationStatus()
  const updateType = useUpdateType()
  const updateTotalSeconds = useUpdateTotalSeconds()

  return useCallback(
    async (newChainId: ChainId) => {
      try {
        // Always update the site network ID first
        dispatch(setSiteNetworkId(newChainId))

        // Then try to switch the wallet's network if connected
        if (address) {
          await switchChain({ chainId: newChainId })
        }

        // Trigger immediate data refresh
        updateContractBalance()
        updateTotalRegistrations()
        updateTotalBlockShares()
        updateTotalCollateralAmount()
        updateTotalTokensBalance()
        updateBalance()
        updateRewards()
        updateLastClaimedBlock()
        updateRegistrationStatus()
        updateType()
        updateTotalSeconds()
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
      updateContractBalance,
      updateTotalRegistrations,
      updateTotalBlockShares,
      updateTotalCollateralAmount,
      updateTotalTokensBalance,
      updateBalance,
      updateRewards,
      updateLastClaimedBlock,
      updateRegistrationStatus,
      updateType,
      updateTotalSeconds,
    ],
  )
}