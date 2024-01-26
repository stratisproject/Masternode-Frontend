/// <reference types="react-scripts" />

interface Window {
  walletLinkExtension?: any
  ethereum?: {
    isCoinbaseWallet?: true
    isBraveWallet?: true
    isMetaMask?: true
    isRabby?: true
    isTrustWallet?: true
    isLedgerConnect?: true
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: Record<string, unknown>
}
