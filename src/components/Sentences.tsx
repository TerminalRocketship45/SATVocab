import { useState } from 'react'
import type { VocabularyItem } from '../types/vocab'
import { PhaseHeader } from './PhaseHeader'
import { useKeyboard } from '../hooks/useKeyboard'

interface SentencesProps {
  words: VocabularyItem[]
  timer: string
  onComplete: () => void
}

export function Sentences({ words, timer, onComplete }: SentencesProps) {
  const [index, setIndex] = useState(0)
  const [sentences, setSentences] = useState<string[]>(new Array(words.length).fill(''))

  const current = words[index]
  const isLast = index === words.length - 1

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => {
    if (isLast) onComplete()
    else setIndex((i) => Math.min(words.length - 1, i + 1))
  }

  // Arrow keys only fire when textarea is NOT focused (hook skips TEXTAREA targets)
  useKeyboard({
    ArrowLeft: prev,
    ArrowRight: next,
  })

  return (
    <div className="min-h-screen bg-v-bg px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-v-card p-6" style={{ border: '1px solid #252545' }}>
          <PhaseHeader phase={4} wordIndex={index} totalWords={words.length} timer={timer} />

          <div className="mb-4 rounded-xl p-4" style={{ background: '#101020', border: '1px solid #252545' }}>
            <h2 className="font-serif text-3xl font-bold text-v-text">{current.word}</h2>
            <p className="mt-2 text-sm text-v-muted">{current.definition}</p>
          </div>

          <p className="mb-2 text-sm font-medium text-v-text">Write a sentence using this word</p>
          <textarea
            value={sentences[index] || ''}
            onChange={(e) => {
              const val = e.target.value
              setSentences((prev) => { const next = [...prev]; next[index] = val; return next })
            }}
            className="min-h-32 w-full rounded-xl p-4 text-sm leading-relaxed outline-none transition"
            style={{
              background: '#101020',
              border: '1px solid #252545',
              color: '#E5E3FF',
              resize: 'vertical',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7B5CF5')}
            onBlur={(e) => (e.target.style.borderColor = '#252545')}
            placeholder="Type your sentence here… (click outside then use ← → to navigate)"
          />

          <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: '#252545' }}>
            <button
              onClick={prev}
              disabled={index === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm text-v-muted transition hover:text-v-text disabled:opacity-30"
            >
              <Kbd>←</Kbd> Prev
            </button>
            <button
              onClick={next}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
              style={{ background: isLast ? '#2ECDA8' : '#E85555' }}
            >
              {isLast ? 'Finish Session ✓' : <>Next <Kbd>→</Kbd></>}
            </button>
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
