import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useIsLSSTokenSupported, useIsOwner, useWithdrawalDelay } from 'state/stats/hooks'
import {
  useUserBalance,
  useUserLSSTokenBalance,
  useUserType,
  useUserRegistrationStatus,
  useUserCollateralAmount,
  useUserSinceLastClaim,
} from 'state/user/hooks'

import { useLSSTokenContract, useMasterNodeContract } from './useContract'

import { RegistrationStatus, UserType } from 'types'

export function useRegisterUser() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const balance = useUserBalance()
  const userType = useUserType()
  const status = useUserRegistrationStatus()
  const collateralAmount = useUserCollateralAmount()

  const [pending, setPending] = useState(false)

  const registerUser = useCallback(async () => {
    if (!contract || !account || userType === UserType.UNKNOWN || status != RegistrationStatus.UNREGISTERED) {
      return
    }

    if (balance.lt(collateralAmount)) {
      console.log('Not enough balance')
      return
    }

    setPending(true)
    try {
      const tx = await contract.register({ value: collateralAmount })
      await tx.wait()
    } catch (error) {
      console.error(`Failed to register user: ${error}`)
    } finally {
      setPending(false)
    }
  }, [userType, status, balance.toString(), collateralAmount.toString(), account, contract])

  return { pending, registerUser}
}

export function useRegisterUserLSSToken() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const lssTokenContract = useLSSTokenContract()
  const lssTokenBalance = useUserLSSTokenBalance()
  const userType = useUserType()
  const status = useUserRegistrationStatus()
  const collateralAmount = useUserCollateralAmount()

  const [pending, setPending] = useState(false)

  const registerUserLSSToken  = useCallback(async () => {
    if (!contract || !lssTokenContract || !account || userType === UserType.UNKNOWN || status != RegistrationStatus.UNREGISTERED) {
      return
    }

    if (lssTokenBalance.lt(collateralAmount)) {
      console.log('Not enough balance')
      return
    }

    setPending(true)
    try {
      const allowance = await lssTokenContract.allowance(account, contract.address)
      if (allowance.lt(collateralAmount)) {
        const tx = await lssTokenContract.approve(contract.address, collateralAmount)
        await tx.wait()
      }

      const tx = await contract.registerToken(lssTokenContract.address, collateralAmount)
      await tx.wait()
    } catch (error) {
      console.error(`Failed to register user LSS token: ${error}`)
    } finally {
      setPending(false)
    }
  }, [lssTokenBalance.toString(), userType, status, collateralAmount.toString(), account, contract, lssTokenContract])

  return { pending, registerUserLSSToken }
}

export function useClaimRewards() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const claimRewards = useCallback(async () => {
    if (!contract || !account || status !== RegistrationStatus.REGISTERED) {
      return
    }

    setPending(true)
    try {
      const tx = await contract.claimRewards()
      await tx.wait()
    } catch (error) {
      console.error(`Failed to claim rewards: ${error}`)
    } finally {
      setPending(false)
    }
  }, [status, account, contract])

  return { pending, claimRewards }
}

export function useStartWithdrawal() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const startWithdrawal = useCallback(async () => {
    if (!contract || !account || status !== RegistrationStatus.REGISTERED) {
      return
    }

    setPending(true)
    try {
      const tx = await contract.startWithdrawal()
      await tx.wait()
    } catch (error) {
      console.error(`Failed to start withdrawal: ${error}`)
    } finally {
      setPending(false)
    }
  }, [status, account, contract])

  return { pending, startWithdrawal }
}

export function useCompleteWithdrawal() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()
  const withdrawalDelay = useWithdrawalDelay()

  const [pending, setPending] = useState(false)

  const completeWithdrawal = useCallback(async () => {
    if (!contract || !account || status !== RegistrationStatus.WITHDRAWING || sinceLastClaim < withdrawalDelay) {
      return
    }

    setPending(true)
    try {
      const tx = await contract.completeWithdrawal()
      await tx.wait()
    } catch (error) {
      console.error(`Failed to complete withdrawal: ${error}`)
    } finally {
      setPending(false)
    }
  }, [account, contract, status, sinceLastClaim, withdrawalDelay])

  return { pending, completeWithdrawal }
}

export function useEnableLSSTokenSupport() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const lssTokenContract = useLSSTokenContract()
  const isOwner = useIsOwner()
  const isLSSTokenSupported = useIsLSSTokenSupported()

  const [pending, setPending] = useState(false)

  const enableLSSTokenSupport = useCallback(async () => {
    if (!account || !contract || !lssTokenContract || isLSSTokenSupported || !isOwner) {
      return
    }

    setPending(true)
    try {
      const tx = await contract.setSupportedToken(lssTokenContract.address, true)
      await tx.wait()
    } catch (err) {
      console.error(`Failed to enable LSS token support ${err}`)
    } finally {
      setPending(false)
    }
  }, [account, isOwner, isLSSTokenSupported, contract, lssTokenContract])

  return { pending, enableLSSTokenSupport }
}
