import { useCallback, useMemo } from 'react'
import { usePublicClient, useAccount } from 'wagmi'
import { BigNumber } from 'ethers'

import { useAppDispatch, useAppSelector } from 'state'

import { MASTERNODE_ADDRESS, MULTICALL3_ADDRESS, DEFAULT_OWNER } from '../../constants'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import MULTICALL3_ABI from 'constants/multicall3'

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
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'getEthBalance',
      args: [MASTERNODE_ADDRESS],
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'totalRegistrations',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'totalCollateralAmount',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'totalDividends',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'lastBalance',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'withdrawingCollateralAmount',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'totalTokensBalance',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'owner',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'COLLATERAL_AMOUNT',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'COLLATERAL_AMOUNT_LEGACY',
    }, {
      address: MASTERNODE_ADDRESS,
      abi: MASTERNODE_ABI,
      functionName: 'WITHDRAWAL_DELAY',
    }]

    // @ts-ignore
    const response = await client.multicall({
      contracts: calls as any,
    })

    dispatch(setContractBalance((response[0]?.result as bigint).toString()))
    dispatch(setTotalRegistrations(Number(response[1]?.result as bigint)))
    dispatch(setTotalCollateralAmount((response[2]?.result as bigint).toString()))
    dispatch(setTotalDividends((response[3]?.result as bigint).toString()))
    dispatch(setLastBalance((response[4]?.result as bigint).toString()))
    dispatch(setWithdrawingCollateralAmount((response[5]?.result as bigint).toString()))
    dispatch(setTotalTokensBalance((response[6]?.result as bigint).toString()))
    dispatch(setOwner(response[7]?.result as string))
    dispatch(setCollateralAmount((response[8]?.result as bigint).toString()))
    dispatch(setCollateralAmountLegacy((response[9]?.result as bigint).toString()))
    dispatch(setWithdrawalDelay(Number(response[10]?.result as bigint)))
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
