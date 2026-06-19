import { useState } from 'react'
import type { VocabularyItem } from '../types/vocab'
import { PhaseHeader } from './PhaseHeader'
import { useKeyboard } from '../hooks/useKeyboard'

interface FlashcardsProps {
  words: VocabularyItem[]
  timer: string
  onContinue: () => void
}

export function Flashcards({ words, timer, onContinue }: FlashcardsProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Set<number>>(new Set())

  const current = words[index]
  const allSeen = seen.size === words.length

  const flip = () => {
    setFlipped((f) => !f)
    setSeen((s) => new Set([...s, index]))
  }

  const go = (dir: 'prev' | 'next') => {
    setFlipped(false)
    setTimeout(() => {
      setIndex((i) => (dir === 'prev' ? Math.max(0, i - 1) : Math.min(words.length - 1, i + 1)))
    }, 100)
  }

  useKeyboard({
    ArrowLeft: () => go('prev'),
    ArrowRight: () => go('next'),
    ' ': flip,
    Enter: () => { if (allSeen) onContinue() },
  })

  return (
    <div className="min-h-screen bg-v-bg px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-v-card p-6" style={{ border: '1px solid #252545' }}>
          <PhaseHeader phase={1} wordIndex={index} totalWords={words.length} timer={timer} />

          {/* Flip card */}
          <div className="card-flip mb-6 h-72 cursor-pointer" onClick={flip}>
            <div className={`card-inner relative h-full w-full ${flipped ? 'flipped' : ''}`}>
              {/* Front: word */}
              <div
                className="card-face absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                style={{ background: '#101020', border: '1px solid #252545' }}
              >
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-v-muted">
                  Space to flip
                </p>
                <h2 className="font-serif text-5xl font-bold text-v-text">{current.word}</h2>
                {!flipped && (
                  <div className="mt-6 flex gap-1">
                    {words.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 w-1 rounded-full transition-colors"
                        style={{ background: i === index ? '#7B5CF5' : seen.has(i) ? '#7B5CF540' : '#252545' }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Back: definition */}
              <div
                className="card-face card-back absolute inset-0 flex flex-col items-center justify-center rounded-xl p-8"
                style={{ background: '#0E1E1A', border: '1px solid #2ECDA830' }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-v-green mb-4">{current.word}</p>
                <p className="text-center text-xl leading-relaxed text-v-text">{current.definition}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => go('prev')}
              disabled={index === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm text-v-muted transition hover:text-v-text disabled:opacity-30"
            >
              <Kbd>←</Kbd> Prev
            </button>

            <button
              onClick={() => go('next')}
              disabled={index === words.length - 1}
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm text-v-muted transition hover:text-v-text disabled:opacity-30"
            >
              Next <Kbd>→</Kbd>
            </button>
          </div>

          <div className="mt-4 border-t pt-4" style={{ borderColor: '#252545' }}>
            {allSeen ? (
              <button
                onClick={onContinue}
                className="w-full rounded-xl py-3 font-semibold text-white transition hover:opacity-90"
                style={{ background: '#7B5CF5' }}
              >
                Continue to Quiz → <span className="ml-2 font-mono text-xs opacity-60">Enter</span>
              </button>
            ) : (
              <p className="text-center font-mono text-xs text-v-muted">
                See all {words.length} cards to continue · {seen.size}/{words.length} seen
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded px-1.5 py-0.5 font-mono text-xs"
      style={{ background: '#252545', color: '#9896C0', minWidth: 22 }}
    >
      {children}
    </span>
  )
}
