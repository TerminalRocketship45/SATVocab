import type { SessionRecord, SessionStats } from '../types/vocab'

interface DashboardProps {
  stats: SessionStats
  onStart: () => void
  onReset: () => void
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function SessionRow({ session }: { session: SessionRecord }) {
  const pct = Math.round((session.score / session.total) * 100)
  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3"
      style={{ background: '#101020', border: '1px solid #252545' }}
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-v-muted">{fmtDate(session.date)}</span>
        <span className="font-mono text-xs text-v-muted">{fmtDuration(session.duration)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-v-text">
          {session.score}/{session.total}
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: pct >= 80 ? '#2ECDA8' : pct >= 60 ? '#F5A523' : '#E85555' }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}

export function Dashboard({ stats, onStart, onReset, onExport, onImport }: DashboardProps) {
  const hasWords = stats.remainingWords > 0

  return (
    <div className="min-h-screen bg-v-bg px-4 py-10">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-v-muted">SAT Vocab Trainer</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-v-text">Vocabulary</h1>
          <p className="mt-1 text-sm text-v-muted">Progress is saved automatically in your browser.</p>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ background: '#12121C', border: '1px solid #252545' }}>
            <p className="font-mono text-2xl font-medium text-v-text">{stats.completedWords}</p>
            <p className="mt-1 font-mono text-xs text-v-muted">done</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#12121C', border: '1px solid #252545' }}>
            <p className="font-mono text-2xl font-medium text-v-text">{stats.remainingWords}</p>
            <p className="mt-1 font-mono text-xs text-v-muted">remaining</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#12121C', border: '1px solid #252545' }}>
            <p className="font-mono text-2xl font-medium text-v-text">{stats.completionPercentage}%</p>
            <p className="mt-1 font-mono text-xs text-v-muted">complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 overflow-hidden rounded-full" style={{ background: '#252545', height: 6 }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.completionPercentage}%`, background: '#7B5CF5' }}
          />
        </div>

        {/* Start CTA */}
        <button
          onClick={onStart}
          disabled={!hasWords}
          className="mb-6 w-full rounded-xl py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          style={{ background: '#7B5CF5', fontSize: 16 }}
        >
          {hasWords ? '▶  Start Session (10 words)' : '✓  All words completed!'}
        </button>

        {/* Session history */}
        {stats.sessions.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-v-muted">Recent Sessions</p>
            <div className="space-y-2">
              {stats.sessions.slice(0, 5).map((s, i) => (
                <SessionRow key={i} session={s} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div
          className="flex flex-wrap items-center gap-2 rounded-xl p-3"
          style={{ background: '#12121C', border: '1px solid #252545' }}
        >
          <button
            onClick={onExport}
            className="rounded-lg px-3 py-1.5 font-mono text-xs text-v-muted transition hover:text-v-text"
          >
            ↓ Export backup
          </button>
          <label className="cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs text-v-muted transition hover:text-v-text">
            ↑ Import backup
            <input type="file" className="hidden" accept="application/json" onChange={onImport} />
          </label>
          <div className="flex-1" />
          <button
            onClick={onReset}
            className="rounded-lg px-3 py-1.5 font-mono text-xs transition"
            style={{ color: '#E8555570' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#E85555')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E8555570')}
          >
            Reset progress
          </button>
        </div>
      </div>
    </div>
  )
}
