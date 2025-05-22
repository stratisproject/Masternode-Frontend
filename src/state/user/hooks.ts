import { useCallback, useMemo } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { BigNumber } from 'ethers'

import {
  MASTERNODE_ADDRESS,
  MULTICALL3_ADDRESS,
  WITHDRAWAL_DELAY,
  BLOCK_SECONDS,
} from '../../constants'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import MULTICALL3_ABI from 'constants/multicall3'

import { useAppDispatch, useAppSelector } from 'state'
import { RegistrationStatus, UserType } from 'types'

import {
  useContractBalance,
  useTotalCollateralAmount,
  useTotalRegistrations,
  useTotalTokensBalance,
  useTotalDividends,
  useLastBalance,
  useWithdrawingCollateralAmount,
} from 'state/stats/hooks'

import { COLLATERAL_AMOUNT, COLLATERAL_AMOUNT_LEGACY } from '../../constants'

import {
  setBalance,
  setType,
  setRegistrationStatus,
  setLastClaimedBlock,
  setSinceLastClaim,
  setTotalSeconds,
  setLastDividends,
  resetState,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const client = usePublicClient()

  return useCallback(async () => {
    if (!client || !address) {
      dispatch(resetState())
      return
    }

    const calls = [{
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'getEthBalance',
      args: [address],
    }, {
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'getBlockNumber',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'accounts',
      args: [address],
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'registrationStatus',
      args: [address],
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'legacy',
      args: [address],
    }]

    // @ts-ignore
    const [ balance, blockNumber, account, registrationStatus, isLegacy ] = await client.multicall({
      contracts: calls as any,
    })
    const lastDividends: bigint = (account?.result as any[])[1]
    const lastClaimedBlock: number = (account?.result as any[])[2]

    dispatch(setBalance((balance?.result as bigint).toString()))
    dispatch(setLastDividends(lastDividends.toString()))
    dispatch(setRegistrationStatus(registrationStatus?.result as any))
    dispatch(setLastClaimedBlock(Number(lastClaimedBlock)))
    dispatch(setSinceLastClaim(Number(blockNumber?.result) - Number(lastClaimedBlock)))
    dispatch(setType(isLegacy ? UserType.LEGACY : UserType.REGULAR))

    if (registrationStatus?.result !== RegistrationStatus.WITHDRAWING) {
      dispatch(setTotalSeconds(0))
    } else {
      const totalSeconds = (Number(lastClaimedBlock) + WITHDRAWAL_DELAY - Number(blockNumber?.result)) * BLOCK_SECONDS
      dispatch(setTotalSeconds(totalSeconds))
    }
  }, [dispatch, client, address])
}

export function useUserBalance() {
  const balance = useAppSelector(state => state.user.balance)
  return useMemo(() => BigNumber.from(balance), [balance])
}

export function useUserRewards() {
  const { address } = useAccount()
  const userStatus = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()
  const contractBalance = useContractBalance()
  const lastClaimedBlock = useUserLastClaimedBlock()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalRegistrations = useTotalRegistrations()
  const totalTokensBalance = useTotalTokensBalance()
  const totalDividends = useTotalDividends()
  const lastBalance = useLastBalance()
  const withdrawingCollateralAmount = useWithdrawingCollateralAmount()
  const userLastDividends = useUserLastDividends()

  return useMemo(() => {
    if (!address || userStatus !== RegistrationStatus.REGISTERED || sinceLastClaim === 0 || totalRegistrations === 0) {
      return BigNumber.from(0)
    }

    const amount = contractBalance.add(totalTokensBalance).sub(lastBalance).sub(totalCollateralAmount).sub(withdrawingCollateralAmount)

    const newTotalDividends = totalDividends.add(amount.div(totalRegistrations))

    const value = newTotalDividends.sub(userLastDividends)
    // Ensure rewards are never negative
    const finalValue = value.lt(0) ? BigNumber.from(0) : value

    return finalValue
  }, [
    address,
    userStatus,
    contractBalance,
    lastClaimedBlock,
    sinceLastClaim,
    totalCollateralAmount,
    totalRegistrations,
    totalTokensBalance,
    totalDividends,
    lastBalance,
    withdrawingCollateralAmount,
    userLastDividends,
  ])
}

export function useUserLastDividends() {
  const val = useAppSelector(state => state.user.lastDividends)
  return useMemo(() => BigNumber.from(val), [val])
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
