import { useEffect, useMemo, useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { Flashcards } from './components/Flashcards'
import { Quiz } from './components/Quiz'
import { MatchingGame } from './components/MatchingGame'
import { PhaseHeader } from './components/PhaseHeader'
import { vocabData } from './data/vocab'
import { clearProgress, exportProgress, importProgress, loadProgress, recordSession, saveProgress } from './utils/storage'
import { useTimer } from './hooks/useTimer'
import type { SessionStats, VocabularyItem } from './types/vocab'
import type { WordResult } from './components/Quiz'

type Phase = 'dashboard' | 'flashcards' | 'quiz' | 'matching' | 'sentences' | 'complete'

function App() {
  const [progress, setProgress] = useState(() => loadProgress())
  const [phase, setPhase] = useState<Phase>('dashboard')
  const [sessionWords, setSessionWords] = useState<VocabularyItem[]>([])
  const [quizScore, setQuizScore] = useState(0)
  const [quizResults, setQuizResults] = useState<WordResult[]>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [sentences, setSentences] = useState<string[]>([])
  const [showResetModal, setShowResetModal] = useState(false)
  const timer = useTimer()

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const stats: SessionStats = useMemo(() => {
    const total = vocabData.length
    const done = progress.completedWords.length
    return {
      totalWords: total,
      completedWords: done,
      remainingWords: Math.max(0, total - done),
      completionPercentage: total === 0 ? 0 : Math.round((done / total) * 100),
      sessions: progress.sessions,
    }
  }, [progress])

  const startSession = () => {
    const remaining = vocabData.filter((item) => !progress.completedWords.includes(item.word))
    const sampled = [...remaining].sort(() => Math.random() - 0.5).slice(0, 10)
    if (sampled.length === 0) return
    setSessionWords(sampled)
    setQuizScore(0)
    setQuizResults([])
    setSentenceIndex(0)
    setSentences(new Array(sampled.length).fill(''))
    timer.start()
    setPhase('flashcards')
  }

  const completeSession = () => {
    const duration = timer.stop()
    const newCompleted = Array.from(new Set([...progress.completedWords, ...sessionWords.map((w) => w.word)]))
    const updated = recordSession({
      date: new Date().toISOString(),
      duration,
      score: quizScore,
      total: sessionWords.length,
    })
    setProgress({ ...updated, completedWords: newCompleted })
    setPhase('complete')
  }

  const handleReset = () => {
    clearProgress()
    setProgress({ completedWords: [], sessions: [] })
    setShowResetModal(false)
    setPhase('dashboard')
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const imported = await importProgress(file)
      setProgress(imported)
      event.target.value = ''
    } catch (err) {
      console.error(err)
    }
  }

  if (phase === 'flashcards') {
    return (
      <Flashcards
        words={sessionWords}
        timer={timer.formatted}
        onContinue={() => setPhase('quiz')}
      />
    )
  }

  if (phase === 'quiz') {
    return (
      <Quiz
        words={sessionWords}
        timer={timer.formatted}
        onComplete={(score, results) => {
          setQuizScore(score)
          setQuizResults(results)
          setPhase('matching')
        }}
      />
    )
  }

  if (phase === 'matching') {
    return (
      <MatchingGame
        words={sessionWords}
        timer={timer.formatted}
        onComplete={() => setPhase('sentences')}
      />
    )
  }

  if (phase === 'sentences') {
    const current = sessionWords[sentenceIndex]
    const go = (dir: 'prev' | 'next') =>
      setSentenceIndex((i) => (dir === 'prev' ? Math.max(0, i - 1) : Math.min(sessionWords.length - 1, i + 1)))

    return (
      <div className="min-h-screen bg-v-bg px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-v-card p-6" style={{ border: '1px solid #252545' }}>
            <PhaseHeader phase={4} wordIndex={sentenceIndex} totalWords={sessionWords.length} timer={timer.formatted} />

            <div className="mb-4 rounded-xl p-4" style={{ background: '#101020', border: '1px solid #252545' }}>
              <h2 className="font-serif text-3xl font-bold text-v-text">{current.word}</h2>
              <p className="mt-2 text-sm text-v-muted">{current.definition}</p>
            </div>

            <p className="mb-2 text-sm font-medium text-v-text">Write a sentence using this word</p>
            <textarea
              value={sentences[sentenceIndex] || ''}
              onChange={(e) => {
                const val = e.target.value
                setSentences((prev) => { const next = [...prev]; next[sentenceIndex] = val; return next })
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
              placeholder="Type your sentence here…"
            />

            <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: '#252545' }}>
              <button
                onClick={() => go('prev')}
                disabled={sentenceIndex === 0}
                className="rounded-lg px-4 py-2 font-mono text-sm text-v-muted transition hover:text-v-text disabled:opacity-30"
              >
                ← Prev
              </button>
              {sentenceIndex < sessionWords.length - 1 ? (
                <button
                  onClick={() => go('next')}
                  className="rounded-xl px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                  style={{ background: '#E85555' }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={completeSession}
                  className="rounded-xl px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                  style={{ background: '#2ECDA8' }}
                >
                  Finish Session ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-v-bg px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-v-muted">Session Complete</p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-v-text">
              {quizScore}/{sessionWords.length}
            </h2>
            <p className="mt-1 font-mono text-sm text-v-muted">
              {Math.round((quizScore / sessionWords.length) * 100)}% on the quiz · {timer.formatted} total
            </p>
          </div>

          <div className="mb-6 space-y-2">
            {sessionWords.map((item) => {
              const result = quizResults.find((r) => r.word === item.word)
              const correct = result?.correct ?? null
              return (
                <div
                  key={item.word}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: '#101020',
                    border: `1px solid ${correct === true ? '#2ECDA840' : correct === false ? '#E8555540' : '#252545'}`,
                  }}
                >
                  <span
                    className="font-mono text-sm w-4 shrink-0"
                    style={{ color: correct === true ? '#2ECDA8' : correct === false ? '#E85555' : '#6866A0' }}
                  >
                    {correct === true ? '✓' : correct === false ? '✗' : '–'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-v-text">{item.word}</p>
                    <p className="truncate text-xs text-v-muted">{item.definition}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setPhase('dashboard')}
            className="w-full rounded-xl py-3 font-semibold text-white transition hover:opacity-90"
            style={{ background: '#7B5CF5' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dashboard
        stats={stats}
        onStart={startSession}
        onReset={() => setShowResetModal(true)}
        onExport={exportProgress}
        onImport={handleImport}
      />
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0A0A11CC' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#18182A', border: '1px solid #252545' }}>
            <h3 className="font-serif text-xl font-bold text-v-text">Reset all progress?</h3>
            <p className="mt-2 text-sm text-v-muted">This clears completed words and session history.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-lg px-4 py-2 font-mono text-sm text-v-muted transition hover:text-v-text"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg px-4 py-2 font-mono text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: '#E85555' }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
