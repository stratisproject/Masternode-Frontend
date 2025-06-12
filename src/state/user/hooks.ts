import { useCallback, useMemo } from 'react'
import { useAccount, useChainId, usePublicClient } from 'wagmi'
import { BigNumber } from 'ethers'

import {
  MASTERNODE_ADDRESS,
  MULTICALL3_ADDRESS,
  MSTRAX_TOKEN_ADDRESSES,
  BLOCK_SECONDS,
} from '../../constants'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import MULTICALL3_ABI from 'constants/multicall3'
import ERC20_ABI from 'constants/abis/erc20'

import { useAppDispatch, useAppSelector } from 'state'
import { RegistrationStatus, UserType } from 'types'
import { ChainId } from 'web3/chains'

import {
  useContractBalance,
  useTotalCollateralAmount,
  useTotalRegistrations,
  useCollateralAmount,
  useCollateralAmountLegacy,
  useWithdrawalDelay,
  useTotalDividends,
  useLastBalance,
  useWithdrawingCollateralAmount,
  useTotalTokensBalance,
} from 'state/stats/hooks'

import {
  setBalance,
  setAccountBalance,
  setType,
  setRegistrationStatus,
  setRegisterToken,
  setLastClaimedBlock,
  setLastDividends,
  setSinceLastClaim,
  setTotalSeconds,
  resetState,
  setMSTRAXBalance,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const chainId = useChainId()
  const client = usePublicClient()
  const withdrawalDelay = useWithdrawalDelay()
  const mstraxTokenAddress = MSTRAX_TOKEN_ADDRESSES[chainId as ChainId]

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
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'accountRegisterToken',
      args: [address],
    }]
    if (mstraxTokenAddress) {
      calls.push({
        address: mstraxTokenAddress,
        abi: ERC20_ABI as any,
        functionName: 'balanceOf',
        args: [address],
      })
    }

    // @ts-ignore
    const [ balance, blockNumber, account, registrationStatus, isLegacy, accountRegisterToken, mstraxBalance ] = await client.multicall({
      contracts: calls as any,
    })
    const accountBalance: bigint = (account?.result as any[])[0]
    const lastDividends: bigint = (account?.result as any[])[1]
    const lastClaimedBlock: number = (account?.result as any[])[2]

    dispatch(setBalance((balance?.result as bigint).toString()))
    dispatch(setAccountBalance(accountBalance.toString()))
    dispatch(setLastDividends(lastDividends.toString()))
    dispatch(setRegistrationStatus(registrationStatus?.result as any))
    dispatch(setLastClaimedBlock(Number(lastClaimedBlock)))
    dispatch(setSinceLastClaim(Number(blockNumber?.result) - Number(lastClaimedBlock)))
    dispatch(setType(isLegacy?.result ? UserType.LEGACY : UserType.REGULAR))
    dispatch(setRegisterToken(accountRegisterToken?.result as string))

    if (registrationStatus?.result !== RegistrationStatus.WITHDRAWING) {
      dispatch(setTotalSeconds(0))
    } else {
      const totalSeconds = (Number(lastClaimedBlock) + withdrawalDelay - Number(blockNumber?.result)) * BLOCK_SECONDS
      dispatch(setTotalSeconds(totalSeconds))
    }
    if (mstraxBalance) {
      dispatch(setMSTRAXBalance((mstraxBalance?.result as bigint).toString()))
    } else {
      dispatch(setMSTRAXBalance('0'))
    }
  }, [dispatch, client, address, withdrawalDelay, mstraxTokenAddress])
}

export function useUserBalance() {
  const value = useAppSelector(state => state.user.balance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useUserMSTRAXTokenBalance() {
  const value = useAppSelector(state => state.user.mSTRAXBalance)
  return useMemo(() => BigNumber.from(value), [value])
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
  const collateralAmount = useCollateralAmount()
  const collateralAmountLegacy = useCollateralAmountLegacy()
  const type = useUserType()
  if (type === UserType.LEGACY) {
    return collateralAmountLegacy
  } else if (type === UserType.REGULAR) {
    return collateralAmount
  }

  return BigNumber.from(0)
}
