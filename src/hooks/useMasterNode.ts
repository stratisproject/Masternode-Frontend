import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'

import {
  useUserBalance,
  useUserType,
  useUserRegistrationStatus,
  useUserSinceLastClaim,
} from 'state/user/hooks'

import { WITHDRAWAL_DELAY } from '../constants'

import { useMasterNodeContract } from './useContract'

import { RegistrationStatus, UserType } from 'types'

export function useRegisterUser() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const balance = useUserBalance()
  const userType = useUserType()
  const status = useUserRegistrationStatus()

  const [pending, setPending] = useState(false)

  const registerUser = useCallback(async () => {
    if (!contract || !address || userType === UserType.UNKNOWN || status != RegistrationStatus.UNREGISTERED) {
      return
    }

    try {
      const collateralAmount = await contract.COLLATERAL_AMOUNT()
      const collateralAmountBigInt = BigInt(collateralAmount.toString())
      const balanceBigInt = BigInt(balance.toString())
      console.log('Required collateral amount:', formatEther(collateralAmountBigInt), 'STRAX')
      console.log('Your balance:', formatEther(balanceBigInt), 'STRAX')
      if (balance.lt(collateralAmount)) {
        console.log('Not enough balance')
        return
      }

      setPending(true)
      const tx = await contract.register({ value: collateralAmount })
      await tx.wait()
    } catch (error) {
      console.error(`Failed to register user: ${error}`)
    } finally {
      setPending(false)
    }
  }, [userType, status, balance.toString(), address, contract])

  return { pending, registerUser }
}

export function useClaimRewards() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const claimRewards = useCallback(async () => {
    if (!contract || !address || status !== RegistrationStatus.REGISTERED) {
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
  }, [status, address, contract])

  return { pending, claimRewards }
}

export function useStartWithdrawal() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const startWithdrawal = useCallback(async () => {
    if (!contract || !address || status !== RegistrationStatus.REGISTERED) {
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
  }, [status, address, contract])

  return { pending, startWithdrawal }
}

export function useCompleteWithdrawal() {
  const { address } = useAccount()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()

  const [pending, setPending] = useState(false)

  const completeWithdrawal = useCallback(async () => {
    if (!contract || !address || status !== RegistrationStatus.WITHDRAWING || sinceLastClaim < WITHDRAWAL_DELAY) {
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
  }, [address, contract, status, sinceLastClaim])

  return { pending, completeWithdrawal }
}
