import { formatEther } from 'ethers/lib/utils'
import { useAppSelector, useAppDispatch } from 'state'
import { useCallback } from 'react'
import { setHide, setShow } from './reducer'
import { useUserRewards, useUserType } from 'state/user/hooks'
import { UserType } from 'types'
import { WITHDRAWAL_DELAY } from '../../constants'

export function useShow() {
  return useAppSelector(state => state.confirm.showModal)
}

export function useConfirmed() {
  return useAppSelector(state => state.confirm.confirmed)
}

export function useContent() {
  return useAppSelector(state => state.confirm.text)
}

export function useIsClaim() {
  return useAppSelector(state => state.confirm.isClaim)
}

export function useShowWithdrawModal() {
  const dispatch = useAppDispatch()
  const userType = useUserType()

  return useCallback(async () => {
    const coolingOffDays = Math.ceil(WITHDRAWAL_DELAY * 15 / 86400) // Convert blocks to days (15s block time)
    let text = 'You are attempting to withdraw your collateral.\n\n'
    text += 'This action is permanent and cannot be reversed.\n\n'
    text += `After you withdraw, there is a cooling-off period of ${coolingOffDays} days, during which your collateral is locked. You will be able to fully reclaim your tokens after this period.\n\n`
    text += 'Are you sure you want to continue?'

    if (userType === UserType.LEGACY) {
      text += '\n\nWARNING: As a Legacy User, you currently enjoy reduced collateral requirements. Withdrawing will forfeit this benefit, and you will need to rejoin under the standard terms.'
    }

    dispatch(setShow({ isClaim: false, text }))
  }, [userType])
}

export function useShowClaimModal() {
  const dispatch = useAppDispatch()
  const rewards = useUserRewards()
  const strax = financial(formatEther(rewards))
  return useCallback(async () => {
    dispatch(setShow({ isClaim: true, text: `You are attempting to claim ${strax} STRAX. Once confirmed, you will receive a prompt in your MetaMask wallet. Would you like to proceed?` }))
  }, [strax])
}

export function useHideModal() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    dispatch(setHide())
  }, [])
}

const financial = (x: string) => {
  return Number.parseFloat(x).toFixed(5)
}

