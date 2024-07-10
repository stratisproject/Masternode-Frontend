import { useState, useEffect } from 'react'

const CountdownTimer = ({ totalSeconds }: { totalSeconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(totalSeconds))

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (totalSeconds >= 0) {
      timer =
        setInterval(() => {
          setTimeLeft(calculateTimeLeft(totalSeconds - 1))
          totalSeconds--
        }, 1000)
    }

    return () => clearInterval(timer)
  }, [totalSeconds])

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
      Time to completion: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  )
}

export default CountdownTimer
