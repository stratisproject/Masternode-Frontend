import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateBalance,
  useUpdateRewards,
  useUpdateBlockShares,
  useUpdateLastClaimedBlock,
  useUpdateRegistrationStatus,
  useUpdateType,
  useUpdateTotalSeconds,
} from './hooks'

export default function Updater() {
  const updateBalance = useUpdateBalance()
  const updateRewards = useUpdateRewards()
  const updateBlockShares = useUpdateBlockShares()
  const updateLastClaimedBlock = useUpdateLastClaimedBlock()
  const updateRegistrationStatus = useUpdateRegistrationStatus()
  const updateType = useUpdateType()
  const updateTotalSeconds = useUpdateTotalSeconds()

  const updateData = useCallback(async () => {
    updateBalance()
    updateRewards()
    updateBlockShares()
    updateLastClaimedBlock()
    updateRegistrationStatus()
    updateType()
    updateTotalSeconds()
  }, [
    updateBalance,
    updateRewards,
    updateBlockShares,
    updateLastClaimedBlock,
    updateRegistrationStatus,
    updateType,
    updateTotalSeconds,
  ])

  useInterval(updateData, 3000)

  return null
}
