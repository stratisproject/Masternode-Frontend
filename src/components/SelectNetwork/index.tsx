import { useState } from 'react'

import { CHAINS } from 'web3/chains'

import { useActiveNetwork, useSwitchNetwork } from 'state/network/hooks'

import Option from './Option'

import styles from './styles.module.scss'

const SelectNetwork = () => {
  const activeNetwork = useActiveNetwork()
  const switchNetwork = useSwitchNetwork()

  const [showOptions, setShowOptions] = useState(false)

  const availableNetworks = Object.values(CHAINS).filter(network => network.available)

  return (
    <div className={styles.network}>
      {/* <div  className="flex gap-2 pointer-events-auto rounded-md bg-purple-700 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500" onClick={() => setShowOptions(true)}>
        {activeNetwork ? (
          <>
            <img width="20px" height="20px" src={activeNetwork.icon} alt={activeNetwork.name} />
            {activeNetwork.name}
          </>
        ) : 'Wrong network'}
      </div> */}
      <a onClick={() => setShowOptions(true)} className="btn-sm text-slate-300 bg-purple-400 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
        <span className="relative inline-flex items-center flex gap-2">
          {activeNetwork ? (
            <>
              <img width="20px" height="20px" src={activeNetwork.icon} alt={activeNetwork.name} />
              {activeNetwork.name}
            </>
          ) : 'Wrong network'} <span
            className="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
        </span>
      </a>
      {showOptions ? (
        <div className={styles.menu}>
          {availableNetworks.map(network => (
            <Option
              key={network.id}
              network={network}
              isActive={activeNetwork?.id === network.id}
              activate={() => {
                switchNetwork(network.id)
                setShowOptions(false)
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default SelectNetwork
