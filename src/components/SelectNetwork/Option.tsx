import { forwardRef } from 'react'

import styles from './styles.module.scss'

interface Props {
  displayName: string
  activate: () => void
  isActive: boolean
}

const Option = forwardRef(({ displayName, activate, isActive }: Props, ref: any) => (
  <button
    ref={ref}
    className={styles.option}
    type="button"
    onClick={activate}
  >
    <div>
      {displayName}
    </div>
    {isActive ? <div className={styles.status} /> : null}
  </button>
))

export default Option
