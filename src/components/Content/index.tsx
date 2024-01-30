import { useCallback } from 'react'
import { formatEther } from 'ethers/lib/utils'

import { RegistrationStatus, UserType } from 'types'

import StatsCard, { StatsCardProps } from './StatsCard'

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

import { CalculatorIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline'

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
      if (pendingRegisterUser || userBalance.lt(userCollateralAmount)) {
        return (
          <button className='cursor-not-allowed rounded-md bg-gray-300 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-purple opacity-50 hover:bg-indigo-500' disabled={true}>
            Register
          </button>
        )
      } else {
        return (
          <button className='cursor-pointer rounded-md bg-purple-800 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white opacity-50 hover:bg-indigo-500' onClick={registerUser}>
            Register
          </button>
        )
      }
    } else if (userRegistrationStatus === RegistrationStatus.REGISTERED) {
      return (
        <>
          <button disabled={userRewards.eq(0) || pendingClaimRewards || pendingStartWithdrawal} onClick={claimRewards}>
            Claim rewards
          </button>
          <button disabled={pendingClaimRewards || pendingStartWithdrawal} onClick={startWithdrawal}>
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

  const genericStatsData: StatsCardProps[] = [
    {
      icon: <CalculatorIcon className="h-6 w-6 text-orange-500" />,
      title: 'MasterNode contract balance',
      value: `${formatEther(balance)} STRAX`,
    },
    {
      icon: <CalculatorIcon className="h-6 w-6 text-orange-500" />,
      title: 'Total collateral amount',
      value: `${formatEther(totalCollateralAmount)} STRAX`,
    },
    {
      icon: <ChartBarSquareIcon className="h-6 w-6 text-orange-500" />,
      title: 'Total registrations',
      value: totalRegistrations,
    },
    {
      icon: <ChartBarSquareIcon className="h-6 w-6 text-orange-500" />,
      title: 'Total block shares',
      value: totalBlockShares,
    },
  ]

  const userStatsData: StatsCardProps[] = [
    {
      icon: <CalculatorIcon className="h-6 w-6 text-orange-500" />,
      title: 'Balance',
      value: `${formatEther(userBalance)} STRAX`,
    },
    {
      icon: <CalculatorIcon className="h-6 w-6 text-orange-500" />,
      title: 'Rewards',
      value: `${formatEther(userRewards)} STRAX`,
    },
    {
      icon: <CalculatorIcon className="h-6 w-6 text-orange-500" />,
      title: 'Collateral amount',
      value: `${formatEther(userCollateralAmount)} STRAX`,
    },
    {
      icon: <ChartBarSquareIcon className="h-6 w-6 text-orange-500" />,
      title: 'Block shares',
      value: userBlockShares,
    },
    {
      icon: <ChartBarSquareIcon className="h-6 w-6 text-orange-500" />,
      title: 'Last claimed block',
      value: userLastClaimedBlock,
    },
  ]

  return (
    <div className="p-5 mb-5">
      <div className="flex flex-wrap gap-4 mb-5">
        {genericStatsData.map((data, index) => (
          <StatsCard
            key={index}
            icon={data.icon}
            title={data.title}
            value={data.value}
          />
        ))}
        {userType !== UserType.UNKNOWN ? (userStatsData.map((data, index) => (
          <StatsCard
            key={index}
            icon={data.icon}
            title={data.title}
            value={data.value}
          />
        ))) : null}
      </div>
      {userType !== UserType.UNKNOWN ? (
        <div className="flex items-center gap-3">
          {renderAction()}
        </div>
      ) : null}
    </div>
  )
}

export default Content
