import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useIsMSTRAXTokenSupported, useIsOwner, useWithdrawalDelay } from 'state/stats/hooks'
import {
  useUserBalance,
  useUserMSTRAXTokenBalance,
  useUserType,
  useUserRegistrationStatus,
  useUserCollateralAmount,
  useUserSinceLastClaim,
} from 'state/user/hooks'

import { useMSTRAXTokenContract, useMasterNodeContract } from './useContract'

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

export function useRegisterUserMSTRAXToken() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const mSTRAXTokenContract = useMSTRAXTokenContract()
  const mSTRAXTokenBalance = useUserMSTRAXTokenBalance()
  const userType = useUserType()
  const status = useUserRegistrationStatus()
  const collateralAmount = useUserCollateralAmount()

  const [pending, setPending] = useState(false)

  const registerUserMSTRAXToken  = useCallback(async () => {
    if (!contract || !mSTRAXTokenContract || !account || userType === UserType.UNKNOWN || status != RegistrationStatus.UNREGISTERED) {
      return
    }

    if (mSTRAXTokenBalance.lt(collateralAmount)) {
      console.log('Not enough balance')
      return
    }

    setPending(true)
    try {
      const allowance = await mSTRAXTokenContract.allowance(account, contract.address)
      if (allowance.lt(collateralAmount)) {
        const tx = await mSTRAXTokenContract.approve(contract.address, collateralAmount)
        await tx.wait()
      }

      const tx = await contract.registerToken(mSTRAXTokenContract.address, collateralAmount)
      await tx.wait()
    } catch (error) {
      console.error(`Failed to register user mSTRAX token: ${error}`)
    } finally {
      setPending(false)
    }
  }, [mSTRAXTokenBalance.toString(), userType, status, collateralAmount.toString(), account, contract, mSTRAXTokenContract])

  return { pending, registerUserMSTRAXToken }
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

export function useEnableMSTRAXTokenSupport() {
  const { account } = useWeb3React()
  const contract = useMasterNodeContract()
  const mSTRAXTokenContract = useMSTRAXTokenContract()
  const isOwner = useIsOwner()
  const isMSTRAXTokenSupported = useIsMSTRAXTokenSupported()

  const [pending, setPending] = useState(false)

  const enableMSTRAXTokenSupport = useCallback(async () => {
    if (!account || !contract || !mSTRAXTokenContract || isMSTRAXTokenSupported || !isOwner) {
      return
    }

    setPending(true)
    try {
      const tx = await contract.setSupportedToken(mSTRAXTokenContract.address, true)
      await tx.wait()
    } catch (err) {
      console.error(`Failed to enable mSTRAX token support ${err}`)
    } finally {
      setPending(false)
    }
  }, [account, isOwner, isMSTRAXTokenSupported, contract, mSTRAXTokenContract])

  return { pending, enableMSTRAXTokenSupport }
}
