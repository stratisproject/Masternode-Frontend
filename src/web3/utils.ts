import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { ChainId, CHAINS } from './chains'

export function isAddress(value: any): string | false {
  try {
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw new Error(`Invalid 'address' parameter: '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

export function isSupportedChain(chainId: number | null | undefined): chainId is ChainId {
  return !!chainId && !!ChainId[chainId] && CHAINS[chainId as ChainId].available
}

export function isTestnet(chainId: number | null | undefined): boolean {
  if (!isSupportedChain(chainId)) return false
  return CHAINS[chainId].testnet
}
