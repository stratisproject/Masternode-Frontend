import { useState, useEffect } from 'react'

const CountdownTimer = ({ totalSeconds }: { totalSeconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(totalSeconds))
  const [isComplete, setIsComplete] = useState(totalSeconds <= 0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (totalSeconds > 0 && !isComplete) {
      timer = setInterval(() => {
        const newTotalSeconds = totalSeconds - 1
        if (newTotalSeconds <= 0) {
          setIsComplete(true)
          setTimeLeft(calculateTimeLeft(0))
          clearInterval(timer)
        } else {
          setTimeLeft(calculateTimeLeft(newTotalSeconds))
        }
      }, 1000)
    } else if (totalSeconds <= 0) {
      setIsComplete(true)
      setTimeLeft(calculateTimeLeft(0))
    }

    return () => clearInterval(timer)
  }, [totalSeconds, isComplete])

  function calculateTimeLeft(seconds: number) {
    return {
      days: Math.floor(seconds / (60 * 60 * 24)),
      hours: Math.floor((seconds / (60 * 60)) % 24),
      minutes: Math.floor((seconds / 60) % 60),
      seconds: seconds % 60,
    }
  }

  return (
    <div>
      {isComplete ? (
        <div>Withdrawal period complete! You can now complete your withdrawal.</div>
      ) : (
        <div>Time to completion: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</div>
      )}
    </div>
  )
}

export default CountdownTimer
