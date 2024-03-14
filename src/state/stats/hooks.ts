import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

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
  const { provider } = useWeb3React()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!provider) {
      dispatch(setContractBalance('0'))
      return
    }

    const val = await provider.getBalance(MASTERNODE_ADDRESS)
    dispatch(setContractBalance(val.toString()))
  }, [provider, dispatch])
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
