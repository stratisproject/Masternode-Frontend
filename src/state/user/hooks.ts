import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

import { useMasterNodeContract } from 'hooks/useContract'

import { useAppDispatch, useAppSelector } from 'state'
import { RegistrationStatus, UserType } from 'types'

import { useContractBalance, useTotalCollateralAmount, useTotalBlockShares } from 'state/stats/hooks'

import { COLLATERAL_AMOUNT, COLLATERAL_AMOUNT_10K, COLLATERAL_AMOUNT_50K } from '../../constants'

import {
  setBalance,
  setRewards,
  setType,
  setRegistrationStatus,
  setLastClaimedBlock,
  setSinceLastClaim,
  setBlockShares,
  setTotalSeconds,
} from './reducer'

export function useUpdateBalance() {
  const { account, provider } = useWeb3React()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!provider || !account) {
      dispatch(setBalance('0'))
      return
    }

    const val = await provider.getBalance(account)
    dispatch(setBalance(val.toString()))
  }, [account, provider, dispatch])
}

export function useUpdateRewards() {
  const dispatch = useAppDispatch()
  const userStatus = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()
  const contractBalance = useContractBalance()
  const lastClaimedBlock = useUserLastClaimedBlock()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalBlockShares = useTotalBlockShares()

  return useCallback(async () => {
    if (userStatus !== RegistrationStatus.REGISTERED || totalBlockShares === 0 || sinceLastClaim === 0) {
      dispatch(setRewards('0'))
      return
    }

    const value = contractBalance.sub(totalCollateralAmount).mul(sinceLastClaim).div(totalBlockShares)
    dispatch(setRewards(value.toString()))
  }, [
    userStatus,
    contractBalance,
    lastClaimedBlock,
    sinceLastClaim,
    totalCollateralAmount,
    totalBlockShares,
  ])
}

export function useUpdateRegistrationStatus() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !account) {
      dispatch(setRegistrationStatus(RegistrationStatus.UNREGISTERED))
      return
    }

    const val = await contract.registrationStatus(account)
    dispatch(setRegistrationStatus(val))
  }, [account, contract, dispatch])
}

export function useUpdateLastClaimedBlock() {
  const { account, provider } = useWeb3React()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!provider || !contract || !account) {
      dispatch(setLastClaimedBlock(0))
      return
    }

    const currentBlock = await provider.getBlockNumber()

    const val = await contract.lastClaimedBlock(account)
    dispatch(setLastClaimedBlock(val.toNumber()))
    dispatch(setSinceLastClaim(currentBlock - val.toNumber()))
  }, [account, provider, contract, dispatch])
}

export function useUpdateBlockShares() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !account) {
      dispatch(setBlockShares(0))
      return
    }

    const val = await contract.checkBlockShares(account)
    dispatch(setBlockShares(val.toNumber()))
  }, [account, contract])
}

export function useUpdateTotalSeconds() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()
  const offset = 100800
  const blockTime = 16

  return useCallback(async () => {

    if (!contract || !account) {
      dispatch(setTotalSeconds(0))
      return
    }

    const registrationStatus = await contract.registrationStatus(account)

    if (registrationStatus !== RegistrationStatus.WITHDRAWING) {
      dispatch(setTotalSeconds(0))
      return
    }

    const lastClaimedBlock = await contract.lastClaimedBlock(account)
    const blockNumber = await contract.provider.getBlockNumber()
    const totalSeconds = (lastClaimedBlock.toNumber() + offset - blockNumber) * blockTime

    dispatch(setTotalSeconds(totalSeconds))
  }, [contract, dispatch])
}

export function useUpdateType() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !account) {
      dispatch(setType(UserType.UNKNOWN))
      return
    }

    const isLegacy10K = await contract.legacy10K(account)
    if (isLegacy10K) {
      setType(UserType.LEGACY_10K)
      return
    }
    const isLegacy50K = await contract.legacy50K(account)
    if (isLegacy50K) {
      setType(UserType.LEGACY_50K)
      return
    }
    dispatch(setType(UserType.REGULAR))
  }, [account, contract])
}

export function useUserBalance() {
  const balance = useAppSelector(state => state.user.balance)
  return useMemo(() => BigNumber.from(balance), [balance])
}

export function useUserRewards() {
  const rewards = useAppSelector(state => state.user.rewards)
  return useMemo(() => BigNumber.from(rewards), [rewards])
}

export function useUserRegistrationStatus() {
  return useAppSelector(state => state.user.registrationStatus)
}

export function useUserLastClaimedBlock() {
  return useAppSelector(state => state.user.lastClaimedBlock)
}

export function useUserSinceLastClaim() {
  return useAppSelector(state => state.user.sinceLastClaim)
}

export function useUserBlockShares() {
  return useAppSelector(state => state.user.blockShares)
}

export function useUserType() {
  return useAppSelector(state => state.user.type)
}

export function useTotalSeconds() {
  return useAppSelector(state => state.user.totalSeconds)
}

export function useUserCollateralAmount() {
  const type = useUserType()
  if (type === UserType.LEGACY_10K) {
    return COLLATERAL_AMOUNT_10K
  } else if (type === UserType.LEGACY_50K) {
    return COLLATERAL_AMOUNT_50K
  } else if (type === UserType.REGULAR) {
    return COLLATERAL_AMOUNT
  }

  return BigNumber.from(0)
}
