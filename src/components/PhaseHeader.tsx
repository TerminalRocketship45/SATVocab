const PHASE_COLORS = ['#7B5CF5', '#F5A523', '#2ECDA8', '#E85555']
const PHASE_NAMES = ['Flashcards', 'Quiz', 'Matching', 'Sentences']

interface PhaseHeaderProps {
  phase: 1 | 2 | 3 | 4
  wordIndex: number
  totalWords: number
  timer: string
}

export function PhaseHeader({ phase, wordIndex, totalWords, timer }: PhaseHeaderProps) {
  const color = PHASE_COLORS[phase - 1]
  const name = PHASE_NAMES[phase - 1]

  return (
    <div className="mb-6">
      {/* Phase progress segments */}
      <div className="mb-4 flex gap-1.5">
        {PHASE_COLORS.map((c, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < phase ? c : '#252545' }}
          />
        ))}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest"
              style={{ color, background: `${color}18` }}
            >
              Phase {phase} · {name}
            </span>
          </div>
          <p className="mt-1.5 font-mono text-sm text-v-muted">
            Word{' '}
            <span className="text-v-text">{wordIndex + 1}</span>
            <span className="text-v-border"> / </span>
            <span>{totalWords}</span>
          </p>
        </div>

        <div
          className="rounded-lg px-3 py-1.5 font-mono text-lg font-medium tabular-nums"
          style={{ color, background: `${color}12` }}
        >
          {timer}
        </div>
      </div>
    </div>
  )
}
