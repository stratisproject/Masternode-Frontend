import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

import { useMasterNodeContract, useLSSTokenContract, useMulticall3Contract } from 'hooks/useContract'
import { BLOCK_TIME_SECONDS } from '../../constants'

import { useAppDispatch, useAppSelector } from 'state'
import { RegistrationStatus, UserType } from 'types'

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
  setLSSTokenBalance,
} from './reducer'

export function useUpdateData() {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const lssTokenContract = useLSSTokenContract()
  const multicall3Contract = useMulticall3Contract()
  const withdrawalDelay = useWithdrawalDelay()

  return useCallback(async () => {
    if (!account || !contract || !multicall3Contract) {
      dispatch(resetState())
      return
    }

    let lastBlock = 0
    let regStatus: RegistrationStatus = RegistrationStatus.UNREGISTERED
    const calls = [{
      call: {
        target: multicall3Contract.address,
        callData: multicall3Contract.interface.encodeFunctionData('getEthBalance', [account]),
      },
      onResult(r: any) {
        const [balance] = multicall3Contract.interface.decodeFunctionResult('getEthBalance', r)
        dispatch(setBalance(balance.toString()))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('legacy', [account]),
      },
      onResult(r: any) {
        const [legacy] = contract.interface.decodeFunctionResult('legacy', r)
        dispatch(setType(legacy ? UserType.LEGACY : UserType.REGULAR))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('registrationStatus', [account]),
      },
      onResult(r: any) {
        const [registrationStatus] = contract.interface.decodeFunctionResult('registrationStatus', r)
        regStatus = registrationStatus
        dispatch(setRegistrationStatus(registrationStatus))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('accountRegisterToken', [account]),
      },
      onResult(r: any) {
        const [registerToken] = contract.interface.decodeFunctionResult('accountRegisterToken', r)
        dispatch(setRegisterToken(registerToken))
      },
    }, {
      call: {
        target: contract.address,
        callData: contract.interface.encodeFunctionData('accounts', [account]),
      },
      onResult(r: any) {
        const [balance, lastClaimedBlock, lastDividends] = contract.interface.decodeFunctionResult('accounts', r)
        lastBlock = lastClaimedBlock
        dispatch(setAccountBalance(balance.toString()))
        dispatch(setLastClaimedBlock(lastClaimedBlock.toNumber()))
        dispatch(setLastDividends(lastDividends.toString()))
      },
    }]

    const { returnData, blockNumber } = await multicall3Contract.callStatic.aggregate(calls.map(({ call }) => call))
    returnData.map((r, idx) => calls[idx].onResult(r))

    dispatch(setSinceLastClaim(blockNumber.toNumber() - lastBlock))

    let totalSeconds = 0
    if (regStatus.valueOf() === RegistrationStatus.WITHDRAWING) {
      totalSeconds = (lastBlock + withdrawalDelay - blockNumber.toNumber()) * BLOCK_TIME_SECONDS
    }

    dispatch(setTotalSeconds(totalSeconds))

    // Update LSS token balance
    let lssTokenBalance = '0'
    if (lssTokenContract) {
      const bal = await lssTokenContract.balanceOf(account)
      lssTokenBalance = bal.toString()
    }

    dispatch(setLSSTokenBalance(lssTokenBalance))
  }, [account, dispatch, contract, lssTokenContract, multicall3Contract, withdrawalDelay])
}

export function useUserBalance() {
  const value = useAppSelector(state => state.user.balance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useUserLSSTokenBalance() {
  const value = useAppSelector(state => state.user.lssTokenBalance)
  return useMemo(() => BigNumber.from(value), [value])
}

export function useUserLastDividends() {
  const value = useAppSelector(state => state.user.lastDividends)
  return useMemo(() => BigNumber.from(value), [value])
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

export function useUserRewards() {
  const { account } = useWeb3React()
  const registrationStatus = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()
  const lastDividends = useUserLastDividends()
  const contractBalance = useContractBalance()
  const totalRegistrations = useTotalRegistrations()
  const totalDividends = useTotalDividends()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalTokensBalance = useTotalTokensBalance()
  const lastBalance = useLastBalance()
  const withdrawingCollateralAmount = useWithdrawingCollateralAmount()

  return useMemo(() => {
    if (!account || registrationStatus !== RegistrationStatus.REGISTERED || sinceLastClaim === 0 || totalRegistrations === 0) {
      return BigNumber.from(0)
    }

    const amount = contractBalance.add(totalTokensBalance).sub(lastBalance).sub(totalCollateralAmount).sub(withdrawingCollateralAmount)
    const newTotalDividends = totalDividends.add(amount.div(totalRegistrations))

    return newTotalDividends.sub(lastDividends)
  }, [
    account,
    registrationStatus,
    sinceLastClaim,
    lastDividends.toString(),
    contractBalance.toString(),
    totalRegistrations,
    totalDividends.toString(),
    totalCollateralAmount.toString(),
    totalTokensBalance.toString(),
    lastBalance.toString(),
    withdrawingCollateralAmount.toString(),
  ])
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
