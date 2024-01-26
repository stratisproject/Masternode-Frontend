import { useMemo } from 'react'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Network } from '@web3-react/network'

import { ConnectionType } from 'web3/connection'
import { isSupportedChain } from 'web3/utils'
import { getContract } from 'web3/utils'
import { useGetConnection } from 'web3/connection'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import { MasterNode } from 'constants/abis/types'

import { MASTERNODE_ADDRESS } from '../constants'

export function useContract<T extends Contract = Contract>(address: string | undefined, ABI: any, withSignerIfPossible = true): T | null {
  const { provider, account, chainId } = useWeb3React()
  const getConnection = useGetConnection()

  return useMemo(() => {
    if (!address || !ABI || !provider) {
      return null
    }

    const networkConnection = getConnection(ConnectionType.NETWORK)
    const networkConnector = networkConnection.connector as Network
    const isValidChain = isSupportedChain(chainId)

    try {
      // Use network connector if the chain is not supported
      if (!isValidChain && networkConnector.customProvider) {
        return getContract(address, ABI, networkConnector.customProvider, undefined)
      }
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, provider, withSignerIfPossible, account, chainId, getConnection ]) as T
}

export function useMasterNodeContract(): MasterNode | null {
  return useContract(MASTERNODE_ADDRESS, MASTERNODE_ABI)
}
