import { useMemo } from 'react'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Network } from '@web3-react/network'

import { useActiveChainId } from 'state/network/hooks'

import { ConnectionType } from 'web3/connection'
import { isSupportedChain } from 'web3/utils'
import { getContract } from 'web3/utils'
import { useGetConnection } from 'web3/connection'

import MULTICALL3_ABI from 'constants/abis/multicall3'
import MASTERNODE_ABI from 'constants/abis/masterNode'
import ERC20_ABI from 'constants/abis/erc20'
import {
  Multicall3,
  MasterNode,
  Erc20,
} from 'constants/abis/types'

import {
  MULTICALL3_ADDRESS,
  MASTERNODE_ADDRESSES,
  LSS_TOKEN_ADDRESSES,
} from '../constants'

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

export function useMulticall3Contract() {
  return useContract<Multicall3>(MULTICALL3_ADDRESS, MULTICALL3_ABI, false)
}

export function useMasterNodeContract() {
  const chainId = useActiveChainId()
  return useContract<MasterNode>(MASTERNODE_ADDRESSES[chainId], MASTERNODE_ABI)
}

export function useLSSTokenContract(withSigner = true) {
  const chainId = useActiveChainId()
  return useContract<Erc20>(LSS_TOKEN_ADDRESSES[chainId], ERC20_ABI, withSigner)
}
