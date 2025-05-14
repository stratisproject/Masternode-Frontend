import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateBalance,
  useUpdateRewards,
  useUpdateLastClaimedBlock,
  useUpdateRegistrationStatus,
  useUpdateType,
  useUpdateTotalSeconds,
} from './hooks'

export default function Updater() {
  const updateBalance = useUpdateBalance()
  const updateRewards = useUpdateRewards()
  const updateLastClaimedBlock = useUpdateLastClaimedBlock()
  const updateRegistrationStatus = useUpdateRegistrationStatus()
  const updateType = useUpdateType()
  const updateTotalSeconds = useUpdateTotalSeconds()

  const updateData = useCallback(async () => {
    updateBalance()
    updateRewards()
    updateLastClaimedBlock()
    updateRegistrationStatus()
    updateType()
    updateTotalSeconds()
  }, [
    updateBalance,
    updateRewards,
    updateLastClaimedBlock,
    updateRegistrationStatus,
    updateType,
    updateTotalSeconds,
  ])

  useInterval(updateData, 15000)

  return null
}
