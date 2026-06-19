import { useMemo, useState } from 'react'
import type { VocabularyItem } from '../types/vocab'
import { PhaseHeader } from './PhaseHeader'
import { useKeyboard } from '../hooks/useKeyboard'

export interface WordResult {
  word: string
  correct: boolean
}

interface QuizProps {
  words: VocabularyItem[]
  timer: string
  onComplete: (score: number, results: WordResult[]) => void
}

export function Quiz({ words, timer, onComplete }: QuizProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<WordResult[]>([])

  const current = words[index]

  const options = useMemo(() => {
    const pool = words.filter((item) => item.definition !== current.definition)
    const incorrect = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
    return [...incorrect.map((i) => i.definition), current.definition].sort(() => Math.random() - 0.5)
  }, [current, words])

  const handleSelect = (choice: string) => {
    if (selected) return
    const correct = choice === current.definition
    setSelected(choice)
    if (correct) setScore((s) => s + 1)
    setResults((r) => [...r, { word: current.word, correct }])
  }

  const next = () => {
    if (!selected) return
    if (index < words.length - 1) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      onComplete(score, [...results])
    }
  }

  useKeyboard({
    '1': () => handleSelect(options[0]),
    '2': () => handleSelect(options[1]),
    '3': () => handleSelect(options[2]),
    '4': () => handleSelect(options[3]),
    Enter: next,
    ArrowRight: next,
  })

  const KEYS = ['1', '2', '3', '4']

  return (
    <div className="min-h-screen bg-v-bg px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-v-card p-6" style={{ border: '1px solid #252545' }}>
          <PhaseHeader phase={2} wordIndex={index} totalWords={words.length} timer={timer} />

          <div className="mb-5">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-v-muted">Define the word</p>
            <h2 className="font-serif text-4xl font-bold text-v-text">{current.word}</h2>
          </div>

          <div className="space-y-2.5">
            {options.map((option, i) => {
              const isCorrect = option === current.definition
              const isSelected = selected === option
              const showCorrect = selected !== null && isCorrect
              const showWrong = isSelected && !isCorrect && selected !== null

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                  className="flex w-full items-start gap-3 rounded-xl px-4 py-3.5 text-left text-sm leading-snug transition-all"
                  style={{
                    background: showCorrect ? '#2ECDA818' : showWrong ? '#E8555518' : '#101020',
                    border: `1px solid ${showCorrect ? '#2ECDA8' : showWrong ? '#E85555' : '#252545'}`,
                    color: showCorrect ? '#2ECDA8' : showWrong ? '#E85555' : '#E5E3FF',
                  }}
                >
                  <span
                    className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs"
                    style={{
                      background: showCorrect ? '#2ECDA830' : showWrong ? '#E8555530' : '#252545',
                      color: showCorrect ? '#2ECDA8' : showWrong ? '#E85555' : '#6866A0',
                    }}
                  >
                    {KEYS[i]}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {selected && (
            <div
              className="mt-4 rounded-xl px-4 py-3 font-mono text-sm"
              style={{
                background: selected === current.definition ? '#2ECDA810' : '#E8555510',
                color: selected === current.definition ? '#2ECDA8' : '#E85555',
                border: `1px solid ${selected === current.definition ? '#2ECDA830' : '#E8555530'}`,
              }}
            >
              {selected === current.definition ? '✓ Correct' : `✗ Answer: ${current.definition}`}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: '#252545' }}>
            <span className="font-mono text-sm text-v-muted">
              Score <span className="text-v-text">{score}</span> / {index + 1}
            </span>
            {selected ? (
              <button
                onClick={next}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                style={{ background: '#F5A523' }}
              >
                {index === words.length - 1 ? 'See Results' : 'Next'}
                <span className="font-mono text-xs opacity-70">Enter</span>
              </button>
            ) : (
              <p className="font-mono text-xs text-v-muted">Press 1 – 4 to answer</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
