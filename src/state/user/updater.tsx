import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateBalance,
  useUpdateRewards,
  useUpdateBlockShares,
  useUpdateLastClaimedBlock,
  useUpdateRegistrationStatus,
  useUpdateType,
} from './hooks'

export default function Updater() {
  const updateBalance = useUpdateBalance()
  const updateRewards = useUpdateRewards()
  const updateBlockShares = useUpdateBlockShares()
  const updateLastClaimedBlock = useUpdateLastClaimedBlock()
  const updateRegistrationStatus = useUpdateRegistrationStatus()
  const updateType = useUpdateType()

  const updateData = useCallback(async () => {
    updateBalance()
    updateRewards()
    updateBlockShares()
    updateLastClaimedBlock()
    updateRegistrationStatus()
    updateType()
  }, [
    updateBalance,
    updateRewards,
    updateBlockShares,
    updateLastClaimedBlock,
    updateRegistrationStatus,
    updateType,
  ])

  useInterval(updateData, 3000)

  return null
}
