import { useMemo, useState } from 'react'
import type { VocabularyItem } from '../types/vocab'
import { PhaseHeader } from './PhaseHeader'

interface MatchingGameProps {
  words: VocabularyItem[]
  timer: string
  onComplete: () => void
}

export function MatchingGame({ words, timer, onComplete }: MatchingGameProps) {
  const shuffledDefs = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words])

  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedDef, setSelectedDef] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<string | null>(null)

  const allMatched = matched.length === words.length

  const tryMatch = (word: string, def: string) => {
    const item = words.find((w) => w.word === word)
    if (item && item.definition === def) {
      setMatched((m) => [...m, word])
      setSelectedWord(null)
      setSelectedDef(null)
      setWrongPair(null)
    } else {
      setWrongPair(word + def)
      setTimeout(() => {
        setWrongPair(null)
        setSelectedWord(null)
        setSelectedDef(null)
      }, 600)
    }
  }

  const pickWord = (word: string) => {
    if (matched.includes(word)) return
    if (selectedDef) {
      tryMatch(word, selectedDef)
    } else {
      setSelectedWord(word === selectedWord ? null : word)
    }
  }

  const pickDef = (def: string, word: string) => {
    if (matched.includes(word)) return
    if (selectedWord) {
      tryMatch(selectedWord, def)
    } else {
      setSelectedDef(def === selectedDef ? null : def)
    }
  }

  return (
    <div className="min-h-screen bg-v-bg px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-v-card p-6" style={{ border: '1px solid #252545' }}>
          <PhaseHeader phase={3} wordIndex={matched.length} totalWords={words.length} timer={timer} />

          <div className="mb-5 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-v-muted">Match each word to its definition</p>
            <span className="font-mono text-sm text-v-muted">
              <span className="text-v-green">{matched.length}</span>/{words.length} matched
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Words column */}
            <div className="space-y-2">
              {words.map((item) => {
                const isMatched = matched.includes(item.word)
                const isSelected = selectedWord === item.word
                const isWrong = wrongPair?.startsWith(item.word)

                return (
                  <button
                    key={item.word}
                    onClick={() => pickWord(item.word)}
                    disabled={isMatched}
                    className="w-full rounded-xl px-4 py-3 text-left font-serif text-base font-bold transition-all"
                    style={{
                      background: isMatched ? '#2ECDA810' : isWrong ? '#E8555518' : isSelected ? '#7B5CF520' : '#101020',
                      border: `1px solid ${isMatched ? '#2ECDA840' : isWrong ? '#E85555' : isSelected ? '#7B5CF5' : '#252545'}`,
                      color: isMatched ? '#2ECDA8' : isWrong ? '#E85555' : isSelected ? '#9D87FF' : '#E5E3FF',
                      opacity: isMatched ? 0.6 : 1,
                    }}
                  >
                    {item.word}
                  </button>
                )
              })}
            </div>

            {/* Definitions column */}
            <div className="space-y-2">
              {shuffledDefs.map((item) => {
                const isMatched = matched.includes(item.word)
                const isSelected = selectedDef === item.definition
                const isWrong = wrongPair?.endsWith(item.definition)

                return (
                  <button
                    key={item.definition}
                    onClick={() => pickDef(item.definition, item.word)}
                    disabled={isMatched}
                    className="w-full rounded-xl px-4 py-3 text-left text-xs leading-snug transition-all"
                    style={{
                      background: isMatched ? '#2ECDA810' : isWrong ? '#E8555518' : isSelected ? '#2ECDA820' : '#101020',
                      border: `1px solid ${isMatched ? '#2ECDA840' : isWrong ? '#E85555' : isSelected ? '#2ECDA8' : '#252545'}`,
                      color: isMatched ? '#2ECDA870' : isWrong ? '#E85555' : isSelected ? '#2ECDA8' : '#9896C0',
                      opacity: isMatched ? 0.5 : 1,
                    }}
                  >
                    {item.definition}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 border-t pt-4" style={{ borderColor: '#252545' }}>
            {allMatched ? (
              <button
                onClick={onComplete}
                className="w-full rounded-xl py-3 font-semibold text-white transition hover:opacity-90"
                style={{ background: '#2ECDA8' }}
              >
                Continue to Sentences →
              </button>
            ) : (
              <p className="text-center font-mono text-xs text-v-muted">
                Select a word, then its definition · {words.length - matched.length} remaining
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
