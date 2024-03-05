//import ConnectButton from 'components/ConnectButton'
//import SelectNetwork from 'components/SelectNetwork'

import STRATIS_ICON from 'assets/images/networks/stratis_logo_white.svg'
import ConnectButton from 'components/ConnectButton'
import SelectNetwork from 'components/SelectNetwork'

const logo = STRATIS_ICON

const Header = () => (
  <header className="absolute w-full z-30">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16 md:h-20">
        <div className="flex-1">
          <a className="inline-flex items-center" href="index.html" aria-label="Cruip">
            <img className="max-w-none" src={logo} width="38" height="38" alt="Stellar" />
            <span className="ml-3 hidden md:block">Stratis Masternode dApp</span>
          </a>
        </div>

        <ul className="flex-2 flex justify-end items-center">
          <li>
            <ConnectButton />
          </li>
          <li className="ml-6">
            <SelectNetwork />
          </li>
        </ul>
      </div>
    </div>
  </header>
)

{/* <div className={styles.header}>
    <div className="flex items-center text-purple-900 gap-3 text-xl">
      <img height="50" width="50" src={logo} alt="Stratis" />
      <span className={styles.title}>Stratis Masternode dApp</span>
    </div>
    <div className={styles.content}>
      <ConnectButton />
      <SelectNetwork />
    </div>
  </div> */}

export default Header
