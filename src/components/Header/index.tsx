import ConnectButton from 'components/ConnectButton'
import SelectNetwork from 'components/SelectNetwork'

import styles from './styles.module.scss'

const Header = () => (
  <div className={styles.header}>
    <div className={styles.content}>
      <ConnectButton />
      <SelectNetwork />
    </div>
  </div>
)

export default Header
