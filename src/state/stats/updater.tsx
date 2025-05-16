import { useCallback } from 'react'

import useInterval from 'hooks/useInterval'

import {
  useUpdateData,
} from './hooks'

export default function Updater() {
  const updateData = useUpdateData()

  const update = useCallback(async () => {
    updateData()
  }, [
    updateData,
  ])

  useInterval(update, 3000)

  return null
}
