import { useCallback, useMemo } from 'react'
import { useAccount, useChainId, usePublicClient } from 'wagmi'
import { BigNumber } from 'ethers'

import {
  MASTERNODE_ADDRESS,
  MULTICALL3_ADDRESS,
  MSTRAX_TOKEN_ADDRESSES,
  BLOCK_SECONDS,
} from '../../constants'
import MASTERNODE_ABI, { MASTERNODE_INTERFACE } from 'constants/abis/masterNode'
import MULTICALL3_ABI, { MULTICALL3_INTERFACE } from 'constants/multicall3'
import ERC20_ABI, { ERC20_INTERFACE } from 'constants/abis/erc20'

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
      target: MULTICALL3_ADDRESS,
      allowFailure: false,
      callData: MULTICALL3_INTERFACE.encodeFunctionData('getEthBalance', [address]),
    }, {
      target: MULTICALL3_ADDRESS,
      allowFailure: false,
      callData: MULTICALL3_INTERFACE.encodeFunctionData('getBlockNumber'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('accounts', [address]),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('registrationStatus', [address]),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('legacy', [address]),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('accountRegisterToken', [address]),
    }]
    if (mstraxTokenAddress) {
      calls.push({
        target: mstraxTokenAddress,
        allowFailure: false,
        callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [address]),
      })
    }

    // @ts-ignore
    const response: any[] = await client.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate3',
      args: [calls],
    })
    const ethBalanceResult = MULTICALL3_INTERFACE.decodeFunctionResult('getEthBalance', response[0].returnData)
    const blockNumberResult = MULTICALL3_INTERFACE.decodeFunctionResult('getBlockNumber', response[1].returnData)
    const accountResult = MASTERNODE_INTERFACE.decodeFunctionResult('accounts', response[2].returnData)
    const registrationStatusResult = MASTERNODE_INTERFACE.decodeFunctionResult('registrationStatus', response[3].returnData)
    const legacyResult = MASTERNODE_INTERFACE.decodeFunctionResult('legacy', response[4].returnData)
    const accountRegisterTokenResult = MASTERNODE_INTERFACE.decodeFunctionResult('accountRegisterToken', response[5].returnData)

    const blockNumber = Number(blockNumberResult.toString())
    const accountBalance = accountResult[0].toString()
    const lastDividends = accountResult[1].toString()
    const lastClaimedBlock = Number(accountResult[2].toString())
    const registrationStatus = Number(registrationStatusResult.toString())
    const isLegacy = legacyResult.toString() === 'true'

    dispatch(setBalance(ethBalanceResult.toString()))
    dispatch(setAccountBalance(accountBalance))
    dispatch(setLastDividends(lastDividends))
    dispatch(setRegistrationStatus(registrationStatus))
    dispatch(setLastClaimedBlock(lastClaimedBlock))
    dispatch(setSinceLastClaim(blockNumber - lastClaimedBlock))
    dispatch(setType(isLegacy ? UserType.LEGACY : UserType.REGULAR))
    dispatch(setRegisterToken(accountRegisterTokenResult.toString()))

    if (registrationStatus !== RegistrationStatus.WITHDRAWING) {
      dispatch(setTotalSeconds(0))
    } else {
      const totalSeconds = (lastClaimedBlock + withdrawalDelay - blockNumber) * BLOCK_SECONDS
      dispatch(setTotalSeconds(totalSeconds))
    }
    if (response[6]) {
      const mstraxBalanceResult = ERC20_INTERFACE.decodeFunctionResult('balanceOf', response[6].returnData)
      dispatch(setMSTRAXBalance(mstraxBalanceResult.toString()))
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
