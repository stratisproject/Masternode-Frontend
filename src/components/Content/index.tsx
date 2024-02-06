import { useCallback, useEffect } from 'react'
import { formatEther } from 'ethers/lib/utils'
import AOS from 'aos'

import { RegistrationStatus, UserType } from 'types'

import GLOW_IMAGE from 'assets/images/glow-bottom.svg'

const glowImage = GLOW_IMAGE

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

import StatsTile, { StatsTileProps } from './StatsTile'
import { ParticleAnimation } from 'utils/particles'

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
      const isDisabled = pendingRegisterUser || userBalance.lt(userCollateralAmount)

      return (
        <button
          className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
            isDisabled
              ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
              : 'cursor-pointer bg-purple-800 text-white'
          }`}
          disabled={isDisabled}
          onClick={isDisabled ? undefined : registerUser}
        >
          Register
        </button>
      )
    } else if (userRegistrationStatus === RegistrationStatus.REGISTERED) {
      const isClaimDisabled = userRewards.eq(0) || pendingClaimRewards || pendingStartWithdrawal
      const isStartDisabled = pendingClaimRewards || pendingStartWithdrawal

      return (
        <>
          <button
            className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
              isClaimDisabled
                ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                : 'cursor-pointer bg-purple-800 text-white'
            }`}
            disabled={isClaimDisabled}
            onClick={isClaimDisabled ? undefined : claimRewards}
          >
            Claim rewards
          </button>
          <button
            className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
              isStartDisabled
                ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                : 'cursor-pointer bg-purple-800 text-white'
            }`}
            disabled={isStartDisabled}
            onClick={isStartDisabled ? undefined : startWithdrawal}
          >
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

  const financial = (x: string) => {
    return Number.parseFloat(x).toFixed(5)
  }

  const genericStatsData: StatsTileProps[] = [
    {
      title: 'MasterNode contract balance',
      value: `${financial(formatEther(balance))} STRAX`,
    },
    {
      title: 'Total collateral amount',
      value: `${financial(formatEther(totalCollateralAmount))} STRAX`,
    },
    {
      title: 'Total registrations',
      value: totalRegistrations,
    },
    {
      title: 'Total block shares',
      value: totalBlockShares,
    },
  ]

  const userStatsData: StatsTileProps[] = [
    {
      title: 'Balance',
      value: `${financial(formatEther(userBalance))} STRAX`,
    },
    {
      title: 'Rewards',
      value: `${financial(formatEther(userRewards))} STRAX`,
    },
    {
      title: 'Collateral amount',
      value: `${financial(formatEther(userCollateralAmount))} STRAX`,
    },
    {
      title: 'Block shares',
      value: userBlockShares,
    },
    {
      title: 'Last claimed block',
      value: userLastClaimedBlock,
    },
  ]

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 1000,
      easing: 'ease-out-cubic',
    })

    const canvasElements = document.querySelectorAll('[data-particle-animation]')
    canvasElements.forEach((canvas: any) => {
      const options = {
        quantity: canvas.dataset.particleQuantity,
        staticity: canvas.dataset.particleStaticity,
        ease: canvas.dataset.particleEase,
      }
      new ParticleAnimation(canvas, options)
    })
  }, [])

  return (
    <main className="grow">
      <section>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <canvas data-particle-animation></canvas>
          </div>

          <div className="absolute inset-0 -z-10 -mx-28 pointer-events-none overflow-hidden"
            aria-hidden="true">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 -z-10">
              <img src={glowImage} className="max-w-none" width="1146" height="774" alt="Hero Illustration" />
            </div>
          </div>

          <div className="pt-32 pb-16 md:pt-32 md:pb-20">

            <div className="relative pb-12 md:pb-20">
              <div className="absolute bottom-0 -mb-20 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none"
                aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
                  <defs>
                    <linearGradient id="bs2-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                      <stop offset="0%" stop-color="#6366F1"></stop>
                      <stop offset="100%" stop-color="#6366F1" stop-opacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path fill="url(#bs2-a)" fill-rule="evenodd" d="m346 898 461 369-284 58z"
                    transform="translate(-346 -898)"></path>
                </svg>
              </div>
              <div className="grid md:grid-cols-3 gap-6 group" data-highlighter="">
                {genericStatsData.map((data, index) => (
                  <StatsTile
                    key={index}
                    title={data.title}
                    value={data.value}
                  />
                ))}
                {userType !== UserType.UNKNOWN ? (userStatsData.map((data, index) => (
                  <StatsTile
                    key={index}
                    title={data.title}
                    value={data.value}
                  />
                ))) : null}
              </div>
              {userType !== UserType.UNKNOWN ? (
                <div className="flex items-center gap-3 pt-4">
                  {renderAction()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Content
