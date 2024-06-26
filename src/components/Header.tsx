import React, { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

import useClickOutside from "hooks/global/useClickOutside";
import SvgLogo from "assets/logo.svg";

const Header = () => {
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const account = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  return (
    <header className="w-full px-16 py-8 border border-b-gray-200 flex justify-end items-center gap-12">
      {account.address ? (
        <>
          <button
            className="border border-gray-300 rounded-4 p-8 outline-none bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
            onClick={() => disconnect()}
          >
            {account.address}
          </button>
        </>
      ) : (
        <button className="border border-gray-300 rounded-4 p-8 outline-none bg-gray-100" onClick={openConnectModal}>
          Connect Wallet
        </button>
      )}

      <div
        className={`relative shrink-0 ${account.address ? "block" : "hidden"}`}
        ref={useClickOutside(() => {
          setShowNetworkMenu(false);
        })}
      >
        <button
          className="border border-gray-300 rounded-4 p-8 outline-none flex items-center gap-8 flex-none"
          onClick={() => setShowNetworkMenu(!showNetworkMenu)}
        >
          {account.chain ? (
            <>
              <img src={SvgLogo} className="w-20 h-20" alt="" />
              <div className="whitespace-nowrap">{account.chain.name}</div>
            </>
          ) : (
            <div>Wrong Network</div>
          )}
        </button>
        <div
          className={`absolute right-0 top-full mt-12 bg-white shadow-md p-12 rounded-8 border border-gray-100 w-180 ${
            showNetworkMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-event-none"
          }`}
        >
          {chains.map((chain, i) => {
            return (
              <div
                key={i}
                className="whitespace-nowrap cursor-pointer p-4 flex items-center gap-8"
                onClick={() => {
                  switchChain({ chainId: chain.id });
                  setShowNetworkMenu(false);
                }}
              >
                <img src={SvgLogo} className="w-20 h-20" alt="" />
                {chain.name}
                {account?.chain?.id === chain.id && <div className="w-8 h-8 rounded-full bg-green-500 ml-auto"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
