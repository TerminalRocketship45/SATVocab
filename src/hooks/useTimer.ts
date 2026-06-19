import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [active, setActive] = useState(false)
  const startRef = useRef<number>(0)

  const start = useCallback(() => {
    startRef.current = Date.now()
    setElapsed(0)
    setActive(true)
  }, [])

  const stop = useCallback((): number => {
    setActive(false)
    const final = Math.floor((Date.now() - startRef.current) / 1000)
    return final
  }, [])

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  const format = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return { elapsed, formatted: format(elapsed), start, stop }
}
