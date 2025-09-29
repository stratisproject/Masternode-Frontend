import { useCallback, useMemo } from 'react'
import { usePublicClient, useAccount, createConfig } from 'wagmi'
import { BigNumber } from 'ethers'

import { useAppDispatch, useAppSelector } from 'state'

import MASTERNODE_ABI, { MASTERNODE_INTERFACE } from 'constants/abis/masterNode'
import MULTICALL3_ABI, { MULTICALL3_INTERFACE } from 'constants/multicall3'

import { MASTERNODE_ADDRESS, MULTICALL3_ADDRESS, DEFAULT_OWNER } from '../../constants'

import {
  setOwner,
  setContractBalance,
  setCollateralAmount,
  setCollateralAmountLegacy,
  setWithdrawalDelay,
  setTotalCollateralAmount,
  setTotalTokensBalance,
  setTotalDividends,
  setTotalRegistrations,
  setLastBalance,
  setWithdrawingCollateralAmount,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const client = usePublicClient()

  return useCallback(async () => {
    if (!client) {
      return
    }

    const calls = [{
      target: MULTICALL3_ADDRESS,
      allowFailure: false,
      callData: MULTICALL3_INTERFACE.encodeFunctionData('getEthBalance', [MASTERNODE_ADDRESS]),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('totalRegistrations'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('totalCollateralAmount'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('totalDividends'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('lastBalance'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('withdrawingCollateralAmount'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('totalTokensBalance'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('owner'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('COLLATERAL_AMOUNT'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('COLLATERAL_AMOUNT_LEGACY'),
    }, {
      target: MASTERNODE_ADDRESS,
      allowFailure: false,
      callData: MASTERNODE_INTERFACE.encodeFunctionData('WITHDRAWAL_DELAY'),
    }]

    // @ts-ignore
    const response: any[] = await client.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate3',
      args: [calls],
    })

    const contractBalanceResult = MULTICALL3_INTERFACE.decodeFunctionResult('getEthBalance', response[0].returnData)
    const totalRegistrationsResult = MASTERNODE_INTERFACE.decodeFunctionResult('totalRegistrations', response[1].returnData)
    const totalCollateralAmountResult = MASTERNODE_INTERFACE.decodeFunctionResult('totalCollateralAmount', response[2].returnData)
    const totalDividendsResult = MASTERNODE_INTERFACE.decodeFunctionResult('totalDividends', response[3].returnData)
    const lastBalanceResult = MASTERNODE_INTERFACE.decodeFunctionResult('lastBalance', response[4].returnData)
    const withdrawingCollateralAmountResult = MASTERNODE_INTERFACE.decodeFunctionResult('withdrawingCollateralAmount', response[5].returnData)
    const totalTokensBalanceResult = MASTERNODE_INTERFACE.decodeFunctionResult('totalTokensBalance', response[6].returnData)
    const ownerResult = MASTERNODE_INTERFACE.decodeFunctionResult('owner', response[7].returnData)
    const collateralAmountResult = MASTERNODE_INTERFACE.decodeFunctionResult('COLLATERAL_AMOUNT', response[8].returnData)
    const collateralAmountLegacyResult = MASTERNODE_INTERFACE.decodeFunctionResult('COLLATERAL_AMOUNT_LEGACY', response[9].returnData)
    const withdrawalDelayResult = MASTERNODE_INTERFACE.decodeFunctionResult('WITHDRAWAL_DELAY', response[10].returnData)

    dispatch(setContractBalance(contractBalanceResult.toString()))
    dispatch(setTotalRegistrations(Number(totalRegistrationsResult.toString())))
    dispatch(setTotalCollateralAmount(totalCollateralAmountResult.toString()))
    dispatch(setTotalDividends(totalDividendsResult.toString()))
    dispatch(setLastBalance(lastBalanceResult.toString()))
    dispatch(setWithdrawingCollateralAmount(withdrawingCollateralAmountResult.toString()))
    dispatch(setTotalTokensBalance(totalTokensBalanceResult.toString()))
    dispatch(setOwner(ownerResult.toString()))
    dispatch(setCollateralAmount(collateralAmountResult.toString()))
    dispatch(setCollateralAmountLegacy(collateralAmountLegacyResult.toString()))
    dispatch(setWithdrawalDelay(Number(withdrawalDelayResult.toString())))
  }, [dispatch, client])
}

export function useIsOwner() {
  const { address } = useAccount()
  const owner = useAppSelector(state => state.stats.owner)

  return (!!address && (address.toLowerCase() === owner.toLowerCase() || address.toLowerCase() === DEFAULT_OWNER.toLowerCase()))
}

export function useContractBalance() {
  const value = useAppSelector(state => state.stats.contractBalance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useCollateralAmount() {
  const value = useAppSelector(state => state.stats.collateralAmount)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useCollateralAmountLegacy() {
  const value = useAppSelector(state => state.stats.collateralAmountLegacy)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useWithdrawalDelay() {
  return useAppSelector(state => state.stats.withdrawalDelay)
}

export function useTotalRegistrations() {
  return useAppSelector(state => state.stats.totalRegistrations)
}

export function useTotalCollateralAmount() {
  const value = useAppSelector(state => state.stats.totalCollateralAmount)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useTotalTokensBalance() {
  const value = useAppSelector(state => state.stats.totalTokensBalance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useLastBalance() {
  const value = useAppSelector(state => state.stats.lastBalance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useWithdrawingCollateralAmount() {
  const value = useAppSelector(state => state.stats.withdrawingCollateralAmount)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useTotalDividends() {
  const value = useAppSelector(state => state.stats.totalDividends)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useIsMSTRAXTokenSupported() {
  return useAppSelector(state => state.stats.isMSTRAXTokenSupported)
}
