import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

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
  const { account } = useWeb3React()
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
    if (!account || !contract || userStatus !== RegistrationStatus.REGISTERED || sinceLastClaim === 0 || totalRegistrations === 0) {
      dispatch(setRewards('0'))
      return
    }

    const existingDividends = await contract.totalDividends()
    const lastBalance = await contract.lastBalance()
    const withdrawingCollateralAmount = await contract.withdrawingCollateralAmount()

    const amount = contractBalance.sub(lastBalance).sub(totalCollateralAmount).sub(withdrawingCollateralAmount)

    const newTotalDividends = existingDividends.add(amount.div(totalRegistrations))
    const userLastDividends = await (await contract.accounts(account)).lastDividends

    const value = newTotalDividends.sub(userLastDividends)

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

    const val = (await contract.accounts(account)).lastClaimedBlock
    dispatch(setLastClaimedBlock(val.toNumber()))
    dispatch(setSinceLastClaim(currentBlock - val.toNumber()))
  }, [account, provider, contract, dispatch])
}

export function useUpdateBlockShares() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    dispatch(setBlockShares(0))
    return
  }, [dispatch])
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

    const lastClaimedBlock = (await contract.accounts(account)).lastClaimedBlock
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

    const isLegacy = await contract.legacy(account)
    if (isLegacy) {
      dispatch(setType(UserType.LEGACY))
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
  if (type === UserType.LEGACY) {
    return COLLATERAL_AMOUNT_LEGACY
  } else if (type === UserType.REGULAR) {
    return COLLATERAL_AMOUNT
  }

  return BigNumber.from(0)
}
