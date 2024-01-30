import ConnectButton from 'components/ConnectButton'
import SelectNetwork from 'components/SelectNetwork'

import styles from './styles.module.scss'

import STRATIS_ICON from 'assets/images/networks/stratis_logo.svg'

const logo = STRATIS_ICON

const Header = () => (
  <div className={styles.header}>
    <div className="flex items-center text-purple-900 gap-3 text-xl">
      <img height="50" width="50" src={logo} alt="Stratis" />
      <span className={styles.title}>Stratis Masternode dApp</span>
    </div>
    <div className={styles.content}>
      <ConnectButton />
      <SelectNetwork />
    </div>
  </div>
)

export default Header
