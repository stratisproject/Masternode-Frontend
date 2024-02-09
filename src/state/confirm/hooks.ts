import { formatEther } from 'ethers/lib/utils'
import { useAppSelector, useAppDispatch } from 'state'
import { useCallback } from 'react'
import { setHide, setShow } from './reducer'
import { useUserRewards } from 'state/user/hooks'

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

  return useCallback(async () => {
    dispatch(setShow({ isClaim: false, text: 'You are attempting to withdraw your collateral. This will have a mandatory cooling off period of approximately 2 weeks. Are you sure you want to continue?' }))
  }, [])
}

export function useShowClaimModal() {
  const dispatch = useAppDispatch()
  const rewards = useUserRewards()
  const strax = financial(formatEther(rewards))
  return useCallback(async () => {
    dispatch(setShow({ isClaim: true, text: `You are attempting to claim ${strax} STRAX. Once confirmed, you will receive a prompt in your MetaMask wallet. Would you plike to proceed?` }))
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

