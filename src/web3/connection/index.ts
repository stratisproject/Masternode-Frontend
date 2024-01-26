import { useCallback } from 'react'

import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Network } from '@web3-react/network'
import { MetaMask } from '@web3-react/metamask'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'

import { RPC_PROVIDERS } from 'web3/providers'
import { CHAINS, DEFAULT_CHAIN_ID } from 'web3/chains'
import { isMobile } from 'utils/userAgent'

import METAMASK_ICON_URL from 'assets/images/wallets/metamask.svg'
import GNOSIS_ICON_URL from 'assets/images/wallets/gnosis.png'
import WALLET_CONNECT_ICON_URL from 'assets/images/wallets/walletConnectIcon.svg'
import COINBASE_ICON_URL from 'assets/images/wallets/coinbaseWalletIcon.svg'
import INJECTED_LIGHT_ICON_URL from 'assets/images/wallets/browser-wallet-light.svg'

import { WalletConnectPopup } from './WalletConnect'

import { getIsInjected, getIsMetaMaskWallet, getIsCoinbaseWallet } from './utils'

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}

export interface Connection {
  getName(): string
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  getIcon(): string
  shouldDisplay(): boolean
  overrideActivate?(): boolean
  isNew?: boolean
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  actions => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: DEFAULT_CHAIN_ID }),
)
export const networkConnection: Connection = {
  getName: () => 'Network',
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
  getIcon: () => '',
  shouldDisplay: () => false,
}

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsInjectedMobileBrowser = () => getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

const getShouldAdvertiseMetaMask = () => !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet())
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  actions => new MetaMask({ actions, onError }),
)
const injectedConnection: Connection = {
  getName: () => (getIsGenericInjector() ? 'Browser Wallet' : 'MetaMask'),
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  getIcon: () => (getIsGenericInjector() ? INJECTED_LIGHT_ICON_URL : METAMASK_ICON_URL),
  shouldDisplay: () => getIsMetaMaskWallet() || getShouldAdvertiseMetaMask() || getIsGenericInjector(),
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      globalThis.window?.open('https://metamask.io/', 'inst_metamask')
      return true
    }
    return false
  },
}

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(actions => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
  getName: () => 'Gnosis Safe',
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  getIcon: () => GNOSIS_ICON_URL,
  shouldDisplay: () => false,
}

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnectPopup>(actions => new WalletConnectPopup({ actions, onError }))
export const walletConnectConnection: Connection = {
  getName: () => 'WalletConnect',
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
  getIcon: () => WALLET_CONNECT_ICON_URL,
  shouldDisplay: () => !getIsInjectedMobileBrowser(),
}

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: CHAINS[DEFAULT_CHAIN_ID].urls[0],
        appName: 'MasterNode dAPP',
      },
      onError,
    }),
)
const coinbaseWalletConnection: Connection = {
  getName: () => 'Coinbase Wallet',
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  getIcon: () => COINBASE_ICON_URL,
  shouldDisplay: () => Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      globalThis.window?.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  },
}

export function getConnections() {
  return [
    injectedConnection,
    walletConnectConnection,
    coinbaseWalletConnection,
    gnosisSafeConnection,
    networkConnection,
  ]
}

export function useGetConnection() {
  return useCallback((c: Connector | ConnectionType) => {
    if (c instanceof Connector) {
      const connection = getConnections().find(connection => connection.connector === c)
      if (!connection) {
        throw new Error('unsupported connector')
      }
      return connection
    }

    switch (c) {
    case ConnectionType.INJECTED:
      return injectedConnection
    case ConnectionType.COINBASE_WALLET:
      return coinbaseWalletConnection
    case ConnectionType.GNOSIS_SAFE:
      return gnosisSafeConnection
    case ConnectionType.WALLET_CONNECT:
      return walletConnectConnection
    case ConnectionType.NETWORK:
      return networkConnection
    }
  }, [])
}
