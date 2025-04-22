import { useCallback, useMemo } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { BigNumber } from 'ethers'
import { getBalance, getBlockNumber } from 'viem/actions'

import { useMasterNodeContract } from 'hooks/useContract'

import { useAppDispatch, useAppSelector } from 'state'
import { RegistrationStatus, UserType } from 'types'

import { useContractBalance, useTotalCollateralAmount, useTotalBlockShares, useTotalRegistrations } from 'state/stats/hooks'

import { COLLATERAL_AMOUNT, COLLATERAL_AMOUNT_LEGACY } from '../../constants'

import {
  setBalance,
  setRewards,
  setType,
  setRegistrationStatus,
  setLastClaimedBlock,
  setSinceLastClaim,
  setTotalSeconds,
  setBlockShares,
} from './reducer'

export function useUpdateBalance() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!publicClient || !address) {
      dispatch(setBalance('0'))
      return
    }

    const balance = await getBalance(publicClient, { address })
    dispatch(setBalance(balance.toString()))
  }, [address, publicClient, dispatch])
}

export function useUpdateRewards() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()
  const userStatus = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()
  const contractBalance = useContractBalance()
  const lastClaimedBlock = useUserLastClaimedBlock()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalBlockShares = useTotalBlockShares()
  const totalRegistrations = useTotalRegistrations()

  return useCallback(async () => {
    if (!address || !contract || userStatus !== RegistrationStatus.REGISTERED || sinceLastClaim === 0 || totalRegistrations === 0) {
      dispatch(setRewards('0'))
      return
    }

    const existingDividends = await contract.totalDividends()
    const lastBalance = await contract.lastBalance()
    const withdrawingCollateralAmount = await contract.withdrawingCollateralAmount()

    const amount = contractBalance.sub(lastBalance).sub(totalCollateralAmount).sub(withdrawingCollateralAmount)

    const newTotalDividends = existingDividends.add(amount.div(totalRegistrations))
    const userLastDividends = await (await contract.accounts(address)).lastDividends

    const value = newTotalDividends.sub(userLastDividends)
    // Ensure rewards are never negative
    const finalValue = value.lt(0) ? BigNumber.from(0) : value

    dispatch(setRewards(finalValue.toString()))
  }, [
    address,
    contract,
    userStatus,
    contractBalance,
    lastClaimedBlock,
    sinceLastClaim,
    totalCollateralAmount,
    totalBlockShares,
    totalRegistrations,
    dispatch,
  ])
}

export function useUpdateRegistrationStatus() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !address) {
      dispatch(setRegistrationStatus(RegistrationStatus.UNREGISTERED))
      return
    }

    const val = await contract.registrationStatus(address)
    dispatch(setRegistrationStatus(val))
  }, [address, contract, dispatch])
}

export function useUpdateLastClaimedBlock() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const publicClient = usePublicClient()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !address || !publicClient) {
      dispatch(setLastClaimedBlock(0))
      return
    }

    const account = await contract.accounts(address)
    const blockNumber = await getBlockNumber(publicClient)
    const lastClaimedBlockNumber = account.lastClaimedBlock.toNumber()
    dispatch(setLastClaimedBlock(lastClaimedBlockNumber))
    dispatch(setSinceLastClaim(Number(blockNumber) - lastClaimedBlockNumber))
  }, [address, contract, publicClient, dispatch])
}

export function useUpdateBlockShares() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    dispatch(setBlockShares(0))
    return
  }, [dispatch])
}

export function useUpdateTotalSeconds() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const publicClient = usePublicClient()
  const dispatch = useAppDispatch()
  const offset = 100800
  const blockTime = 15

  return useCallback(async () => {
    if (!contract || !address || !publicClient) {
      dispatch(setTotalSeconds(0))
      return
    }

    const registrationStatus = await contract.registrationStatus(address)

    if (registrationStatus !== RegistrationStatus.WITHDRAWING) {
      dispatch(setTotalSeconds(0))
      return
    }

    const lastClaimedBlock = (await contract.accounts(address)).lastClaimedBlock
    const blockNumber = await getBlockNumber(publicClient)
    const totalSeconds = (lastClaimedBlock.toNumber() + offset - Number(blockNumber)) * blockTime

    dispatch(setTotalSeconds(totalSeconds))
  }, [address, contract, publicClient, dispatch])
}

export function useUpdateType() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    if (!contract || !address) {
      dispatch(setType(UserType.UNKNOWN))
      return
    }

    const isLegacy = await contract.legacy(address)
    if (isLegacy) {
      dispatch(setType(UserType.LEGACY))
      return
    }
    dispatch(setType(UserType.REGULAR))
  }, [address, contract, dispatch])
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
  if (type === UserType.LEGACY) {
    return COLLATERAL_AMOUNT_LEGACY
  } else if (type === UserType.REGULAR) {
    return COLLATERAL_AMOUNT
  }

  return BigNumber.from(0)
}
