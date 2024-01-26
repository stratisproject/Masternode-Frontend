import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import {
  useUserBalance,
  useUserType,
  useUserRegistrationStatus,
  useUserCollateralAmount,
  useUserSinceLastClaim,
} from 'state/user/hooks'

import { WITHDRAWAL_DELAY } from '../constants'

import { useMasterNodeContract } from './useContract'

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

  const [pending, setPending] = useState(false)

  const completeWithdrawal = useCallback(async () => {
    if (!contract || !account || status !== RegistrationStatus.WITHDRAWING || sinceLastClaim < WITHDRAWAL_DELAY) {
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
  }, [account, contract, status, sinceLastClaim])

  return { pending, completeWithdrawal }
}
