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
      <div  className="flex gap-2 pointer-events-auto rounded-md bg-purple-700 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500" onClick={() => setShowOptions(true)}>
        {activeNetwork ? (
          <>
            <img width="20px" height="20px" src={activeNetwork.icon} alt={activeNetwork.name} />
            {activeNetwork.name}
          </>
        ) : 'Wrong network'}
      </div>
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
