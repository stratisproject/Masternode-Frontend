import { useState, useCallback } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
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
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const contract = useMasterNodeContract()
  const balance = useUserBalance()
  const userType = useUserType()
  const status = useUserRegistrationStatus()

  const [pending, setPending] = useState(false)

  const registerUser = useCallback(async () => {
    if (!contract || !address || !walletClient || !publicClient || userType === UserType.UNKNOWN || status != RegistrationStatus.UNREGISTERED) {
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
      // Get the contract address
      const contractAddress = contract.address as `0x${string}`
      // Create the transaction data for the register function
      const data = contract.interface.encodeFunctionData('register')
      // Send the transaction using the wallet client directly
      const hash = await walletClient.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: contractAddress,
          value: `0x${collateralAmountBigInt.toString(16)}`,
          data: data as `0x${string}`,
        }],
      }) as `0x${string}`
      // Wait for the transaction to be mined
      const receipt = await publicClient.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      console.log('Transaction successful:', receipt)
    } catch (error) {
      console.error(`Failed to register user: ${error}`)
    } finally {
      setPending(false)
    }
  }, [userType, status, balance.toString(), address, contract, walletClient, publicClient])

  return { pending, registerUser }
}

export function useClaimRewards() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const claimRewards = useCallback(async () => {
    if (!contract || !address || !walletClient || !publicClient || status !== RegistrationStatus.REGISTERED) {
      return
    }

    setPending(true)
    try {
      // Get the contract address
      const contractAddress = contract.address as `0x${string}`
      // Create the transaction data for the claimRewards function
      const data = contract.interface.encodeFunctionData('claimRewards')
      // Send the transaction using the wallet client directly
      const hash = await walletClient.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: contractAddress,
          data: data as `0x${string}`,
        }],
      }) as `0x${string}`
      // Wait for the transaction to be mined
      const receipt = await publicClient.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      console.log('Transaction successful:', receipt)
    } catch (error) {
      console.error(`Failed to claim rewards: ${error}`)
    } finally {
      setPending(false)
    }
  }, [status, address, contract, walletClient, publicClient])

  return { pending, claimRewards }
}

export function useStartWithdrawal() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const [pending, setPending] = useState(false)

  const startWithdrawal = useCallback(async () => {
    if (!contract || !address || !walletClient || !publicClient || status !== RegistrationStatus.REGISTERED) {
      return
    }

    setPending(true)
    try {
      // Get the contract address
      const contractAddress = contract.address as `0x${string}`
      // Create the transaction data for the startWithdrawal function
      const data = contract.interface.encodeFunctionData('startWithdrawal')
      // Send the transaction using the wallet client directly
      const hash = await walletClient.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: contractAddress,
          data: data as `0x${string}`,
        }],
      }) as `0x${string}`
      // Wait for the transaction to be mined
      const receipt = await publicClient.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      console.log('Transaction successful:', receipt)
    } catch (error) {
      console.error(`Failed to start withdrawal: ${error}`)
    } finally {
      setPending(false)
    }
  }, [status, address, contract, walletClient, publicClient])

  return { pending, startWithdrawal }
}

export function useCompleteWithdrawal() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const contract = useMasterNodeContract()
  const status = useUserRegistrationStatus()
  const sinceLastClaim = useUserSinceLastClaim()

  const [pending, setPending] = useState(false)

  const completeWithdrawal = useCallback(async () => {
    if (!contract || !address || !walletClient || !publicClient || status !== RegistrationStatus.WITHDRAWING || sinceLastClaim < WITHDRAWAL_DELAY) {
      return
    }

    setPending(true)
    try {
      // Get the contract address
      const contractAddress = contract.address as `0x${string}`
      // Create the transaction data for the completeWithdrawal function
      const data = contract.interface.encodeFunctionData('completeWithdrawal')
      // Send the transaction using the wallet client directly
      const hash = await walletClient.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: contractAddress,
          data: data as `0x${string}`,
        }],
      }) as `0x${string}`
      // Wait for the transaction to be mined
      const receipt = await publicClient.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      console.log('Transaction successful:', receipt)
    } catch (error) {
      console.error(`Failed to complete withdrawal: ${error}`)
    } finally {
      setPending(false)
    }
  }, [address, contract, status, sinceLastClaim, walletClient, publicClient])

  return { pending, completeWithdrawal }
}
