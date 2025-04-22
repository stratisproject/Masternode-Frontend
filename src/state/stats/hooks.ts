import { useCallback, useMemo } from 'react'
import { usePublicClient } from 'wagmi'
import { BigNumber } from 'ethers'
import { getBalance } from 'viem/actions'

import { useMasterNodeContract } from 'hooks/useContract'

import { useAppDispatch, useAppSelector } from 'state'

import { MASTERNODE_ADDRESS } from '../../constants'

import {
  setContractBalance,
  setTotalCollateralAmount,
  setTotalRegistrations,
  setTotalBlockShares,
} from './reducer'

export function useUpdateContractBalance() {
  const publicClient = usePublicClient()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!publicClient) {
      dispatch(setContractBalance('0'))
      return
    }

    const balance = await getBalance(publicClient, { address: MASTERNODE_ADDRESS })
    dispatch(setContractBalance(balance.toString()))
  }, [publicClient, dispatch])
}

export function useUpdateTotalRegistrations() {
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract) {
      dispatch(setTotalRegistrations(0))
      return
    }

    const val = await contract.totalRegistrations()
    dispatch(setTotalRegistrations(val.toNumber()))
  }, [contract, dispatch])
}

export function useUpdateTotalCollateralAmount() {
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract) {
      dispatch(setTotalCollateralAmount('0'))
      return
    }

    const val = await contract.totalCollateralAmount()
    dispatch(setTotalCollateralAmount(val.toString()))
  }, [contract, dispatch])
}

export function useUpdateTotalBlockShares() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    dispatch(setTotalBlockShares(0))
    return
  }, [dispatch])
}

export function useContractBalance() {
  const balance = useAppSelector(state => state.stats.contractBalance)
  return useMemo(() => BigNumber.from(balance), [balance])
}

export function useTotalRegistrations() {
  return useAppSelector(state => state.stats.totalRegistrations)
}

export function useTotalCollateralAmount() {
  const amount = useAppSelector(state => state.stats.totalCollateralAmount)
  return useMemo(() => BigNumber.from(amount), [amount])
}

export function useTotalBlockShares() {
  return useAppSelector(state => state.stats.totalBlockShares)
}
