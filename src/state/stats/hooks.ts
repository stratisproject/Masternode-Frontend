import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'

import { useMasterNodeContract, useLSSTokenContract, useMulticall3Contract } from 'hooks/useContract'
import { DEFAULT_OWNER } from '../../constants'

import { useAppDispatch, useAppSelector } from 'state'

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
  setIsLSSTokenSupported,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const contract = useMasterNodeContract()
  const lssTokenContract = useLSSTokenContract()
  const multicall3Contract = useMulticall3Contract()

  return useCallback(async () => {
    if (!contract || !multicall3Contract) {
      return
    }

    const calls = [{
      call: {
        target: multicall3Contract.address,
        callData: multicall3Contract.interface.encodeFunctionData('getEthBalance', [contract.address]),
      },
      onResult(r: any) {
        const [balance] = multicall3Contract.interface.decodeFunctionResult('getEthBalance', r)
        dispatch(setContractBalance(balance.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('owner'),
      },
      onResult(r: any) {
        const [owner] = contract.interface.decodeFunctionResult('owner', r)
        dispatch(setOwner(owner))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('COLLATERAL_AMOUNT'),
      },
      onResult(r: any) {
        const [collateralAmount] = contract.interface.decodeFunctionResult('COLLATERAL_AMOUNT', r)
        dispatch(setCollateralAmount(collateralAmount.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('COLLATERAL_AMOUNT_LEGACY'),
      },
      onResult(r: any) {
        const [collateralAmountLegacy] = contract.interface.decodeFunctionResult('COLLATERAL_AMOUNT_LEGACY', r)
        dispatch(setCollateralAmountLegacy(collateralAmountLegacy.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('WITHDRAWAL_DELAY'),
      },
      onResult(r: any) {
        const [withdrawalDelay] = contract.interface.decodeFunctionResult('WITHDRAWAL_DELAY', r)
        dispatch(setWithdrawalDelay(withdrawalDelay.toNumber()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('totalCollateralAmount'),
      },
      onResult(r: any) {
        const [totalCollateralAmount] = contract.interface.decodeFunctionResult('totalCollateralAmount', r)
        dispatch(setTotalCollateralAmount(totalCollateralAmount.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('totalTokensBalance'),
      },
      onResult(r: any) {
        const [totalTokensBalance] = contract.interface.decodeFunctionResult('totalTokensBalance', r)
        dispatch(setTotalTokensBalance(totalTokensBalance.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('totalDividends'),
      },
      onResult(r: any) {
        const [totalDividends] = contract.interface.decodeFunctionResult('totalDividends', r)
        dispatch(setTotalDividends(totalDividends.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('totalRegistrations'),
      },
      onResult(r: any) {
        const [totalRegistrations] = contract.interface.decodeFunctionResult('totalRegistrations', r)
        dispatch(setTotalRegistrations(totalRegistrations.toNumber()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('lastBalance'),
      },
      onResult(r: any) {
        const [lastBalance] = contract.interface.decodeFunctionResult('lastBalance', r)
        dispatch(setLastBalance(lastBalance.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('withdrawingCollateralAmount'),
      },
      onResult(r: any) {
        const [withdrawingCollateralAmount] = contract.interface.decodeFunctionResult('withdrawingCollateralAmount', r)
        dispatch(setWithdrawingCollateralAmount(withdrawingCollateralAmount.toString()))
      },
    }]

    const result = await multicall3Contract.callStatic.aggregate(calls.map(({ call }) => call))
    result.returnData.map((r, idx) => calls[idx].onResult(r))

    let lssTokenSupported = false
    if (lssTokenContract) {
      lssTokenSupported = await contract.supportedTokens(lssTokenContract.address)
    }

    dispatch(setIsLSSTokenSupported(lssTokenSupported))
  }, [dispatch, contract, lssTokenContract, multicall3Contract])
}

export function useIsOwner() {
  const { account } = useWeb3React()
  const owner = useAppSelector(state => state.stats.owner)

  return (!!account && (account.toLowerCase() === owner.toLowerCase() || account.toLowerCase() === DEFAULT_OWNER.toLowerCase()))
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

export function useIsLSSTokenSupported() {
  return useAppSelector(state => state.stats.isLSSTokenSupported)
}
