import { useCallback, useEffect } from 'react'
import { formatEther } from 'ethers/lib/utils'
import AOS from 'aos'

import { RegistrationStatus, UserType } from 'types'

import GLOW_IMAGE from 'assets/images/glow-bottom.svg'

const glowImage = GLOW_IMAGE

import {
  useShow,
  useShowWithdrawModal,
  useShowClaimModal,
  useHideModal,
  useContent,
  useIsClaim,
  //useContent,
} from 'state/confirm/hooks'

import {
  useRegisterUser,
  useRegisterUserLSSToken,
  useClaimRewards,
  useStartWithdrawal,
  useCompleteWithdrawal,
  useEnableLSSTokenSupport,
} from 'hooks/useMasterNode'

import {
  useUserBalance,
  useUserLSSTokenBalance,
  useUserRewards,
  useUserLastClaimedBlock,
  useUserSinceLastClaim,
  useUserRegistrationStatus,
  useUserType,
  useUserCollateralAmount,
  useTotalSeconds,
} from 'state/user/hooks'

import {
  useContractBalance,
  useTotalTokensBalance,
  useIsLSSTokenSupported,
  useIsOwner,
  useTotalCollateralAmount,
  useTotalRegistrations,
  useWithdrawalDelay,
} from 'state/stats/hooks'

import StatsTile, { StatsTileProps } from './StatsTile'
import { ParticleAnimation } from 'utils/particles'
import ConfirmModal from 'components/ConfirmModal'
import CountdownTimer from 'components/CountdownTimer'

const Content = () => {
  const { pending: pendingRegisterUser, registerUser } = useRegisterUser()
  const { pending: pendingRegisterUserLSSToken, registerUserLSSToken } = useRegisterUserLSSToken()
  const { pending: pendingClaimRewards, claimRewards } = useClaimRewards()
  const { pending: pendingStartWithdrawal, startWithdrawal } = useStartWithdrawal()
  const { pending: pendingCompleteWithdrawal, completeWithdrawal } = useCompleteWithdrawal()
  const { pending: pendingEnableLSSTokenSupport, enableLSSTokenSupport } = useEnableLSSTokenSupport()

  const balance = useContractBalance()
  const totalTokensBalance = useTotalTokensBalance()
  const totalCollateralAmount = useTotalCollateralAmount()
  const totalRegistrations = useTotalRegistrations()
  const totalSeconds = useTotalSeconds()
  const withdrawalDelay = useWithdrawalDelay()
  const isOwner = useIsOwner()
  const isLSSTokenSupported = useIsLSSTokenSupported()

  const userType = useUserType()
  const userBalance = useUserBalance()
  const userLSSTokenBalance = useUserLSSTokenBalance()
  const userRewards = useUserRewards()
  const userLastClaimedBlock = useUserLastClaimedBlock()
  const userSinceLastClaim = useUserSinceLastClaim()
  const userRegistrationStatus = useUserRegistrationStatus()
  const userCollateralAmount = useUserCollateralAmount()

  //const userConfirmed = useConfirmed()
  const showModal = useShow()
  const confirmMessage = useContent()
  const isClaim = useIsClaim()

  const hideModal = useHideModal()

  const showClaimConfirmation = useShowClaimModal()

  const showWithdrawConfirmation = useShowWithdrawModal()

  const renderAction = useCallback(() => {
    if (userRegistrationStatus === RegistrationStatus.UNREGISTERED) {
      const isDisabledRegularRegister = pendingRegisterUser || userBalance.lt(userCollateralAmount)
      const isDisabledLSSTokenRegister = pendingRegisterUserLSSToken || userLSSTokenBalance.lt(userCollateralAmount)

      return (
        <div className="flex flex-col gap-2">
          <div>
            <button
              className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
                (isDisabledRegularRegister || pendingRegisterUserLSSToken)
                  ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                  : 'cursor-pointer bg-purple-800 text-white'
              }`}
              disabled={isDisabledRegularRegister || pendingRegisterUserLSSToken}
              onClick={(isDisabledRegularRegister || pendingRegisterUserLSSToken) ? undefined : registerUser}
            >
              Register
            </button>
            <span className='text-xs text-red-400'>
              { userBalance.lt(userCollateralAmount) ? ` You do not have the required collateral to register. Please ensure you have a balance of ${formatEther(userCollateralAmount)} STRAX before trying to register` : null}
            </span>
          </div>
          <div>
            <button
              className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
                (isDisabledLSSTokenRegister || pendingRegisterUser)
                  ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                  : 'cursor-pointer bg-purple-800 text-white'
              }`}
              disabled={isDisabledLSSTokenRegister || pendingRegisterUser}
              onClick={(isDisabledLSSTokenRegister || pendingRegisterUser) ? undefined : registerUserLSSToken}
            >
              Register LSS Token
            </button>
            <span className='text-xs text-red-400'>
              { userLSSTokenBalance.lt(userCollateralAmount) ? ` You do not have the required collateral to register. Please ensure you have a balance of ${formatEther(userCollateralAmount)} lssSTRAX before trying to register` : null}
            </span>
          </div>
        </div>
      )
    } else if (userRegistrationStatus === RegistrationStatus.REGISTERED) {
      const isClaimDisabled = userRewards.lte(0) || pendingClaimRewards || pendingStartWithdrawal
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
            onClick={isClaimDisabled ? undefined : showClaimConfirmation}
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
            onClick={isStartDisabled ? undefined : showWithdrawConfirmation}
          >
            Start withdrawal
          </button>
        </>
      )
    } else if (userRegistrationStatus === RegistrationStatus.WITHDRAWING) {
      const disabled = pendingCompleteWithdrawal || userSinceLastClaim < withdrawalDelay
      return (
        <>
          <button
            className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
              disabled
                ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                : 'cursor-pointer bg-purple-800 text-white'
            }`}
            disabled={disabled}
            onClick={disabled ? undefined : completeWithdrawal}
          >
            Complete withdrawal
          </button>
          <div>
            {totalSeconds === 0 ? <span>Calculating time...</span> : <CountdownTimer totalSeconds={totalSeconds} />}
          </div>
        </>
      )
    }

    return null
  }, [
    userBalance.toString(),
    userLSSTokenBalance.toString(),
    userRewards.toString(),
    userCollateralAmount.toString(),
    userRegistrationStatus,
    userSinceLastClaim,
    withdrawalDelay,
    pendingRegisterUser,
    pendingRegisterUserLSSToken,
    pendingClaimRewards,
    pendingStartWithdrawal,
    pendingCompleteWithdrawal,
    registerUser,
    registerUserLSSToken,
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
      title: 'MasterNode contract LSS balance',
      value: `${financial(formatEther(totalTokensBalance))} lssSTRAX`,
    },
    {
      title: 'Total collateral amount',
      value: `${financial(formatEther(totalCollateralAmount))} STRAX`,
    },
    {
      title: 'Total registrations',
      value: totalRegistrations,
    },
  ]

  const userStatsData: StatsTileProps[] = [
    {
      title: 'Balance',
      value: `${financial(formatEther(userBalance))} STRAX`,
    },
    {
      title: 'LSS Token Balance',
      value: `${financial(formatEther(userLSSTokenBalance))} lssSTRAX`,
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
                      <stop offset="0%" stopColor="#6366F1"></stop>
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path fill="url(#bs2-a)" fillRule="evenodd" d="m346 898 461 369-284 58z"
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
              </div>
              {userType !== UserType.UNKNOWN ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6 group mt-6" data-highlighter="">
                    {userStatsData.map((data, index) => (
                      <StatsTile
                        key={index}
                        title={data.title}
                        value={data.value}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    {renderAction()}
                  </div>
                </>
              ) : null}
            </div>
            {(!isLSSTokenSupported && isOwner) ? (
              <div>
                <button
                  className={`rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 hover:bg-indigo-500 ${
                    pendingEnableLSSTokenSupport
                      ? 'cursor-not-allowed bg-gray-300 text-purple opacity-50'
                      : 'cursor-pointer bg-purple-800 text-white'
                  }`}
                  disabled={pendingEnableLSSTokenSupport}
                  onClick={pendingEnableLSSTokenSupport ? undefined : enableLSSTokenSupport}
                >
                  Enable LSS Token support
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      {showModal && (
        <ConfirmModal
          title="Confirm Action"
          body={confirmMessage}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={() => {
            hideModal().then(() => {
              if (isClaim) {
                claimRewards()
              } else {
                startWithdrawal()
              }
            })
          }}
          onCancel={() => {
            hideModal()
          }}
          onClose={() => {
            hideModal()
          }}
        />
      )}
    </main>
  )
}

export default Content

