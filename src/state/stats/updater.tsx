import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateContractBalance,
  useUpdateTotalBlockShares,
  useUpdateTotalCollateralAmount,
  useUpdateTotalRegistrations,
} from './hooks'

export default function Updater() {
  const updateContractBalance = useUpdateContractBalance()
  const updateTotalRegistrations = useUpdateTotalRegistrations()
  const updateTotalBlockShares = useUpdateTotalBlockShares()
  const updateTotalCollateralAmount = useUpdateTotalCollateralAmount()

  const updateData = useCallback(async () => {
    updateContractBalance()
    updateTotalRegistrations()
    updateTotalBlockShares()
    updateTotalCollateralAmount()
  }, [
    updateContractBalance,
    updateTotalRegistrations,
    updateTotalBlockShares,
    updateTotalCollateralAmount,
  ])

  useInterval(updateData, 3000)

  return null
}
