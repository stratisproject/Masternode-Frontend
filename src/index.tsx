import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, rainbowWallet, bitgetWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { auroria } from "viem/chains";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const config = getDefaultConfig({
  appName: "masternode dAPP",
  projectId: "YOUR_PROJECT_ID",
  chains: [auroria],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet, bitgetWallet],
    },
  ],
});

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
