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
      <div className={styles.button} onClick={() => setShowOptions(true)}>
        {activeNetwork ? (
          <>
            <img width="30px" height="30px" src={activeNetwork.icon} alt={activeNetwork.name} />
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
