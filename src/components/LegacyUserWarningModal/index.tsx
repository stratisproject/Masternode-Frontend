import ReactModal from 'react-modal'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import styles from './styles.module.scss'
import { useAppDispatch } from 'state'
import { updateIsWarningModalOpen } from 'state/wallet/reducer'
import { FaExclamationTriangle, FaArrowRight  } from 'react-icons/fa'
import { ComponentType } from 'react'
ReactModal.setAppElement('#root')

interface WarningModalProps {
  onConfirm: () => void;
}

const WarningModal:React.FC<WarningModalProps> = ({ onConfirm }) => {
  const WarningIcon = FaExclamationTriangle as ComponentType<{ className?: string }>
  const Arrow = FaArrowRight as React.ComponentType<{ className?: string }>
  const isWarningModalOpen = useSelector((state:AppState) =>state.wallet.warningModal)
  const dispatch = useAppDispatch()
  return (
    <ReactModal
      isOpen={ isWarningModalOpen as boolean }
      className={styles['modal-content']}
      overlayClassName={styles['modal-overlay']}
      bodyOpenClassName={styles['modal-open']}
      onRequestClose={()=>{
        dispatch(updateIsWarningModalOpen(false))
      }}
    >
      <button className={styles['close-button']} onClick={()=>{
        dispatch(updateIsWarningModalOpen(false))
      }}>
        &times;
      </button>
      <div className={styles['warning-header']}>
        <WarningIcon className={styles['warning-icon']} />
        <span>Warning!</span>
      </div>
      <p className={styles['warning-content']}>You are currently registered as a Legacy Masternode. If you choose to withdraw, you will lose your reduced collateral entitlement and will not be able to re-register under the same terms.</p>
      <button className={styles['next-button']} onClick={onConfirm}>
        <span className={styles['label']}>OK</span>
        <Arrow className={styles['icon']} />
      </button>
    </ReactModal>
  )
}

export default WarningModal
