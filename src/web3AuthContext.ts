import { type Web3AuthContextConfig } from '@web3auth/modal/react'
import { WEB3AUTH_NETWORK, type Web3AuthOptions } from '@web3auth/modal'

if (!import.meta.env.VITE_WEB3AUTH_CLIENT_ID) {
  throw new Error('VITE_WEB3AUTH_CLIENT_ID is not provided')
}

const web3AuthOptions: Web3AuthOptions = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  // web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  defaultChainId: '0x19a91',
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
}

export default web3AuthContextConfig