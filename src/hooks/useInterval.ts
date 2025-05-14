import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void | Promise<void> | Promise<[void]>, delay: null | number, leading = true) {
  const delayRef = useRef(delay)

  useEffect(() => {
    if (delayRef.current === null) {
      return
    }

    let id: NodeJS.Timeout | undefined

    async function tick(skip = false) {
      if (!skip) {
        const promise = callback()
        if (promise) await promise
        // Set delay to null after first execution
        delayRef.current = null
        // Clear the interval after first execution
        if (id) {
          clearInterval(id)
        }
      }
    }

    // Initial tick if leading
    if (leading) {
      tick()
    }

    // Set up interval only if we haven't executed yet
    if (delayRef.current !== null) {
      id = setInterval(() => tick(), delayRef.current)
    }

    return () => {
      if (id) {
        clearInterval(id)
      }
    }
  }, [callback, leading])
}