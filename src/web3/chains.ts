import type { AddEthereumChainParameter } from '@web3-react/types'

import STRATIS_ICON from 'assets/images/networks/stratis.jpeg'

export enum ChainId {
  STRATIS = 105105,
  AURORIA = 205205,
}

export const DEFAULT_CHAIN_ID = ChainId.AURORIA

export const STRATIS_CURRENCY: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Stratis',
  symbol: 'STRAT',
  decimals: 18,
}

export interface BasicChainInformation {
  id: number
  name: string
  icon?: string
  urls: string[]
  available: boolean
  testnet: boolean
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export type ChainInfo = BasicChainInformation | ExtendedChainInformation

function isExtendedChainInformation(
  chainInformation: ChainInfo,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: ChainId): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

type ChainConfig = { [key in ChainId]: ChainInfo }

export const CHAINS: ChainConfig = {
  [ChainId.STRATIS]: {
    id: ChainId.STRATIS,
    name: 'Stratis',
    icon: STRATIS_ICON,
    urls: [],
    nativeCurrency: STRATIS_CURRENCY,
    available: false,
    testnet: false,
  },
  [ChainId.AURORIA]: {
    id: ChainId.AURORIA,
    name: 'Auroria',
    icon: STRATIS_ICON,
    urls: ['https://auroria.rpc.stratisevm.com'],
    nativeCurrency: STRATIS_CURRENCY,
    blockExplorerUrls: ['https://auroria.explorer.stratisevm.com'],
    available: true,
    testnet: true,
  },
}


export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = Object.values(ChainId).filter(
  id => typeof id === 'number',
) as ChainId[]
