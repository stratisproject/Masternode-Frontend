import { useEffect } from 'react'

export default function useInterval(callback: () => void | Promise<void> | Promise<[void]>, delay: null | number, leading = true) {
  useEffect(() => {
    if (delay === null) {
      return
    }

    tick(!leading)

    async function tick(skip = false) {
      if (!skip) {
        const promise = callback()

        if (promise) await promise
      }
    }

    const id = setInterval(() => tick(), delay)

    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [callback, delay, leading])
}