import { useEffect, useState } from 'react'

interface TimerProps {
  seconds: number
  onExpired: () => void
}

export default function Timer({ seconds, onExpired }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpired()
    }
  }, [timeLeft, onExpired])

  const getColorClass = () => {
    if (timeLeft <= 2) return 'bg-error text-white'
    if (timeLeft <= 4) return 'bg-yellow-500 text-white'
    return 'bg-success text-white'
  }

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClass()}`}>
      ⏰ {timeLeft}s
    </div>
  )
}
