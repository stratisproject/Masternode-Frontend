import { Connection, ConnectionType } from 'web3/connection'

import cx from 'classnames'

import styles from './styles.module.scss'

interface Props {
  connection: Connection
  activate: () => void
  pendingConnectionType?: ConnectionType
}

const Option = ({ connection, activate, pendingConnectionType }: Props) => {
  const isPending = connection.type === pendingConnectionType

  return (
    <button
      type="button"
      className={cx(styles['wallet-button'], {[styles.disabled]: !isPending && !!pendingConnectionType}, 'btn col-5 text-center mt-3 py-3')}
      onClick={!pendingConnectionType ? activate : undefined}
    >
      <img src={connection.getIcon?.()} />
      <h3>
        {connection.getName()}
      </h3>
      {isPending && 'Connecting'}
    </button>
  )
}

export default Option
