import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, rainbowWallet, bitgetWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'
import { ChainId, CHAINS, ExtendedChainInformation } from 'web3/chains'

import store, { persistor } from 'state'
import Updater from 'state/updater'
import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.scss'

// We know this is ExtendedChainInformation because we defined it that way in CHAINS
const chainInfo = CHAINS[ChainId.STRATIS] as ExtendedChainInformation
const stratisChain = {
  id: ChainId.STRATIS,
  name: 'Strax',
  network: 'strax',
  nativeCurrency: chainInfo.nativeCurrency,
  rpcUrls: {
    default: { http: ['https://rpc.stratisevm.com'] },
    public: { http: ['https://rpc.stratisevm.com'] },
  },
  blockExplorers: {
    default: { name: 'Strax Explorer', url: 'https://explorer.stratisevm.com' },
  },
}

const auroriaChain = {
  id: ChainId.AURORIA,
  name: 'Auroria',
  network: 'auroria',
  nativeCurrency: chainInfo.nativeCurrency,
  rpcUrls: {
    default: { http: ['https://auroria.rpc.stratisevm.com'] },
    public: { http: ['https://auroria.rpc.stratisevm.com'] },
  },
  blockExplorers: {
    default: { name: 'Auroria Explorer', url: 'https://auroria.explorer.stratisevm.com' },
  },
}

const config = getDefaultConfig({
  appName: 'masternode dAPP',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [stratisChain, auroriaChain],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet, bitgetWallet],
    },
  ],
})

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Updater />
              <App />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
