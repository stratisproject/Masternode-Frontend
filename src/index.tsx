import './polyfills'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3AuthProvider } from '@web3auth/modal/react'
import { WagmiProvider } from '@web3auth/modal/react/wagmi'

import store, { persistor } from 'state'
import Updater from 'state/updater'
import web3AuthContextConfig from './web3AuthContext'
import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.scss'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Web3AuthProvider config={web3AuthContextConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider>
              <Updater />
              <App />
            </WagmiProvider>
          </QueryClientProvider>
        </Web3AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
