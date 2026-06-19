import type { ProgressState, SessionRecord } from '../types/vocab'

const STORAGE_KEY = 'sat-vocab-progress'

const DEFAULT: ProgressState = { completedWords: [], sessions: [] }

export const loadProgress = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completedWords: Array.isArray(parsed.completedWords)
        ? parsed.completedWords.filter((w): w is string => typeof w === 'string')
        : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    }
  } catch {
    return DEFAULT
  }
}

export const saveProgress = (progress: ProgressState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const recordSession = (record: SessionRecord) => {
  const progress = loadProgress()
  const updated: ProgressState = {
    ...progress,
    sessions: [record, ...progress.sessions].slice(0, 20),
  }
  saveProgress(updated)
  return updated
}

export const exportProgress = () => {
  const progress = loadProgress()
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sat-vocab-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importProgress = (file: File): Promise<ProgressState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}')) as Partial<ProgressState>
        if (!parsed || !Array.isArray(parsed.completedWords)) {
          reject(new Error('Invalid progress file.'))
          return
        }
        const state: ProgressState = {
          completedWords: parsed.completedWords.filter((w): w is string => typeof w === 'string'),
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        }
        saveProgress(state)
        resolve(state)
      } catch {
        reject(new Error('Unable to parse progress file.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
