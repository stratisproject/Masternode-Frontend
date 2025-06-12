import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import { useUpdateData } from './hooks'

export default function Updater() {
  const updateAllData = useUpdateData()

  const updateData = useCallback(async () => {
    updateAllData()
  }, [
    updateAllData,
  ])

  useInterval(updateData, 15000)

  return null
}
