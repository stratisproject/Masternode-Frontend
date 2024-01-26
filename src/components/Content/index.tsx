import { useCallback } from 'react'
import { formatEther } from 'ethers/lib/utils'

import { RegistrationStatus, UserType } from 'types'

import {
  useRegisterUser,
  useClaimRewards,
  useStartWithdrawal,
  useCompleteWithdrawal,
} from 'hooks/useMasterNode'

import {
  useUserBalance,
  useUserRewards,
  useUserBlockShares,
  useUserLastClaimedBlock,
  useUserSinceLastClaim,
  useUserRegistrationStatus,
  useUserType,
  useUserCollateralAmount,
} from 'state/user/hooks'

import {
  useContractBalance,
  useTotalCollateralAmount,
  useTotalBlockShares,
  useTotalRegistrations,
} from 'state/stats/hooks'

import { WITHDRAWAL_DELAY } from '../../constants'

import styles from './styles.module.scss'

const Content = () => {
  const { pending: pendingRegisterUser, registerUser } = useRegisterUser()
  const { pending: pendingClaimRewards, claimRewards } = useClaimRewards()
  const { pending: pendingStartWithdrawal, startWithdrawal } = useStartWithdrawal()
  const { pending: pendingCompleteWithdrawal, completeWithdrawal } = useCompleteWithdrawal()

  const balance = useContractBalance()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalBlockShares = useTotalBlockShares()
  const totalRegistrations = useTotalRegistrations()

  const userType = useUserType()
  const userBalance = useUserBalance()
  const userRewards = useUserRewards()
  const userBlockShares = useUserBlockShares()
  const userLastClaimedBlock = useUserLastClaimedBlock()
  const userSinceLastClaim = useUserSinceLastClaim()
  const userRegistrationStatus = useUserRegistrationStatus()
  const userCollateralAmount = useUserCollateralAmount()

  const renderAction = useCallback(() => {
    if (userRegistrationStatus === RegistrationStatus.UNREGISTERED) {
      return (
        <button disabled={pendingRegisterUser || userBalance.lt(userCollateralAmount)} onClick={registerUser}>
          Register
        </button>
      )
    } else if (userRegistrationStatus === RegistrationStatus.REGISTERED) {
      const disabled = userRewards.eq(0) || pendingClaimRewards || pendingStartWithdrawal
      return (
        <>
          <button disabled={disabled} onClick={claimRewards}>
            Claim rewards
          </button>
          <button disabled={disabled} onClick={startWithdrawal}>
            Start withdrawal
          </button>
        </>
      )
    } else if (userRegistrationStatus === RegistrationStatus.WITHDRAWING) {
      const disabled = pendingCompleteWithdrawal || userSinceLastClaim < WITHDRAWAL_DELAY
      return (
        <button disabled={disabled} onClick={completeWithdrawal}>
          Complete withdrawal
        </button>
      )
    }

    return null
  }, [
    userBalance,
    userRewards,
    userCollateralAmount,
    userRegistrationStatus,
    userSinceLastClaim,
    pendingRegisterUser,
    pendingClaimRewards,
    pendingStartWithdrawal,
    pendingCompleteWithdrawal,
    registerUser,
    claimRewards,
    startWithdrawal,
    completeWithdrawal,
  ])

  return (
    <div className={styles.content}>
      <div className={styles.stats}>
        <div className={styles.box}>
          <div className={styles.title}>
            MasterNode contract balance
          </div>
          <div className={styles.value}>
            {`${formatEther(balance)} STRAT`}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.title}>
            Total collateral amount
          </div>
          <div className={styles.value}>
            {`${formatEther(totalCollateralAmount)} STRAT`}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.title}>
            Total registrations
          </div>
          <div className={styles.value}>
            {totalRegistrations}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.title}>
            Total block shares
          </div>
          <div className={styles.value}>
            {totalBlockShares}
          </div>
        </div>
      </div>
      {userType !== UserType.UNKNOWN ? (
        <>
          <div className={styles.stats}>
            <div className={styles.box}>
              <div className={styles.title}>
                Balance
              </div>
              <div className={styles.value}>
                {`${formatEther(userBalance)} STRAT`}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.title}>
                Rewards
              </div>
              <div className={styles.value}>
                {`${formatEther(userRewards)} STRAT`}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.title}>
                Collateral amount
              </div>
              <div className={styles.value}>
                {`${formatEther(userCollateralAmount)} STRAT`}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.title}>
                Block shares
              </div>
              <div className={styles.value}>
                {userBlockShares}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.title}>
                Last claimed block
              </div>
              <div className={styles.value}>
                {userLastClaimedBlock}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            {renderAction()}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Content
