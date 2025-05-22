import { useCallback, useMemo } from 'react'
import { usePublicClient, useChainId } from 'wagmi'
import { BigNumber } from 'ethers'

import { ChainId } from 'web3/chains'

import { useAppDispatch, useAppSelector } from 'state'

import { MASTERNODE_ADDRESS, MULTICALL3_ADDRESS } from '../../constants'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import MULTICALL3_ABI from 'constants/multicall3'

import {
  setContractBalance,
  setTotalCollateralAmount,
  setTotalRegistrations,
  setTotalTokensBalance,
  setTotalDividends,
  setLastBalance,
  setWithdrawingCollateralAmount,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const client = usePublicClient()
  const chainId = useChainId()

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
    }]
    if (chainId === ChainId.AURORIA) {
      calls.push({
        address: MASTERNODE_ADDRESS,
        abi: MASTERNODE_ABI,
        functionName: 'totalTokensBalance',
      })
    }

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
    if (response.length === 7) {
      dispatch(setTotalTokensBalance((response[6]?.result as bigint).toString()))
    } else {
      dispatch(setTotalTokensBalance('0'))
    }
  }, [dispatch, client, chainId])
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

export function useTotalDividends() {
  const val = useAppSelector(state => state.stats.totalDividends)
  return useMemo(() => BigNumber.from(val), [val])
}

export function useLastBalance() {
  const val = useAppSelector(state => state.stats.lastBalance)
  return useMemo(() => BigNumber.from(val), [val])
}

export function useWithdrawingCollateralAmount() {
  const val = useAppSelector(state => state.stats.withdrawingCollateralAmount)
  return useMemo(() => BigNumber.from(val), [val])
}

export function useTotalTokensBalance() {
  const balance = useAppSelector(state => state.stats.totalTokensBalance)
  return useMemo(() => BigNumber.from(balance), [balance])
}
