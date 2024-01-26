import { forwardRef } from 'react'

import { ChainInfo  } from 'web3/chains'

import styles from './styles.module.scss'

interface Props {
  network: ChainInfo
  activate: () => void
  isActive: boolean
}

const Option = forwardRef(({ network, activate, isActive }: Props, ref: any) => (
  <button
    ref={ref}
    className={styles.option}
    type="button"
    onClick={activate}
  >
    <img width="20px" height="20px" src={network.icon} alt={network.name} />
    <div>
      {network.name}
    </div>
    {isActive ? <div className={styles.status} /> : null}
  </button>
))

export default Option
