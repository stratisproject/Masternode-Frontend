import { type Web3AuthContextConfig } from '@web3auth/modal/react'
import { WEB3AUTH_NETWORK, type Web3AuthOptions, MFA_FACTOR } from '@web3auth/modal'

if (!import.meta.env.VITE_WEB3AUTH_CLIENT_ID) {
  throw new Error('VITE_WEB3AUTH_CLIENT_ID is not provided')
}

const web3AuthOptions: Web3AuthOptions = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: import.meta.env.VITE_WEB3AUTH_ENV === 'mainnet' ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  defaultChainId: '0x19a91',
  mfaSettings: {
    [MFA_FACTOR.DEVICE]: {
      enable: true,
      priority: 1,
      mandatory: true, // at least two factors are mandatory
    },
    [MFA_FACTOR.BACKUP_SHARE]: {
      enable: true,
      priority: 2,
      mandatory: true, // at least two factors are mandatory
    },
    [MFA_FACTOR.SOCIAL_BACKUP]: {
      enable: true,
      priority: 3,
      mandatory: false,
    },
    [MFA_FACTOR.PASSWORD]: {
      enable: true,
      priority: 4,
      mandatory: false,
    },
    [MFA_FACTOR.PASSKEYS]: {
      enable: true,
      priority: 5,
      mandatory: false,
    },
    [MFA_FACTOR.AUTHENTICATOR]: {
      enable: true,
      priority: 6,
      mandatory: false,
    },
  },
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
}

export default web3AuthContextConfig