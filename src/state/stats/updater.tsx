import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateContractBalance,
  useUpdateTotalBlockShares,
  useUpdateTotalCollateralAmount,
  useUpdateTotalRegistrations,
  useUpdateTotalTokensBalance,
} from './hooks'

export default function Updater() {
  const updateContractBalance = useUpdateContractBalance()
  const updateTotalRegistrations = useUpdateTotalRegistrations()
  const updateTotalBlockShares = useUpdateTotalBlockShares()
  const updateTotalCollateralAmount = useUpdateTotalCollateralAmount()
  const updateTotalTokensBalance = useUpdateTotalTokensBalance()

  const updateData = useCallback(async () => {
    updateContractBalance()
    updateTotalRegistrations()
    updateTotalBlockShares()
    updateTotalCollateralAmount()
    updateTotalTokensBalance()
  }, [
    updateContractBalance,
    updateTotalRegistrations,
    updateTotalBlockShares,
    updateTotalCollateralAmount,
    updateTotalTokensBalance,
  ])

  useInterval(updateData, 3000)

  return null
}
