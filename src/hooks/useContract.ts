import { useMemo } from 'react'
import { Contract } from 'ethers'
import {
  usePublicClient,
  useAccount,
} from 'wagmi'

import { getWagmiContract } from 'web3/wagmi'

import MASTERNODE_ABI from 'constants/abis/masterNode'
import { MasterNode } from 'constants/abis/types'

import { MASTERNODE_ADDRESS } from '../constants'

export function useContract<T extends Contract = Contract>(address: string | undefined, ABI: any, withSignerIfPossible = true): T | null {
  const publicClient = usePublicClient()
  const { address: account } = useAccount()

  return useMemo(() => {
    if (!address || !ABI || !publicClient) {
      return null
    }

    try {
      return getWagmiContract(
        address,
        ABI,
        publicClient.transport,
        withSignerIfPossible ? account : undefined,
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, publicClient, withSignerIfPossible, account]) as T
}

export function useMasterNodeContract() {
  return useContract<MasterNode>(MASTERNODE_ADDRESS, MASTERNODE_ABI)
}
