import { useEffect, useRef } from 'react'

type KeyMap = Partial<Record<string, () => void>>

export function useKeyboard(keyMap: KeyMap) {
  const ref = useRef(keyMap)
  ref.current = keyMap

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      const fn = ref.current[e.key]
      if (fn) {
        e.preventDefault()
        fn()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
