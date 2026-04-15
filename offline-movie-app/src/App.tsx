import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { downloadMovie } from './offline/download'
import {
  getAllMovieSummaries,
  getMovieById,
  removeMovie,
  saveMovie,
} from './offline/storage'
import type { DownloadProgress } from './offline/download'
import type { StoredMovieSummary } from './offline/storage'
import type { FormEvent } from 'react'

interface ExtensionPayload {
  title: string
  sourceUrl: string
}

function readExtensionPayload(): ExtensionPayload | null {
  const params = new URLSearchParams(window.location.search)
  const sourceUrl = params.get('src')
  if (!sourceUrl) {
    return null
  }

  const title = params.get('title') ?? ''
  window.history.replaceState({}, '', window.location.pathname)
  return {
    title,
    sourceUrl,
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return 'Unexpected error. Please try again.'
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  const unit = units[index] ?? 'B'
  return `${value.toFixed(index === 0 ? 0 : 1)} ${unit}`
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function suggestFileName(title: string, mimeType: string): string {
  const safeTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'offline-movie'
  const extension = mimeType.includes('webm') ? 'webm' : 'mp4'
  return `${safeTitle}.${extension}`
}

function inferTitleFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const filename = pathname.split('/').at(-1)
    if (!filename) {
      return 'Untitled movie'
    }

    return decodeURIComponent(filename).replace(/\.[a-z0-9]+$/i, '')
  } catch {
    return 'Untitled movie'
  }
}

function App() {
  const [movieTitle, setMovieTitle] = useState('')
  const [movieUrl, setMovieUrl] = useState('')
  const [playbackUrl, setPlaybackUrl] = useState('')
  const [isOfflinePlayback, setIsOfflinePlayback] = useState(false)
  const [library, setLibrary] = useState<StoredMovieSummary[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
    totalBytes: null,
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const objectUrlRef = useRef<string | null>(null)

  const percent = useMemo(() => {
    if (!progress.totalBytes) {
      return null
    }

    return Math.min(100, Math.floor((progress.receivedBytes / progress.totalBytes) * 100))
  }, [progress.receivedBytes, progress.totalBytes])

  async function refreshLibrary(): Promise<void> {
    const items = await getAllMovieSummaries()
    setLibrary(items)
  }

  useEffect(() => {
    const payload = readExtensionPayload()
    if (payload) {
      setMovieTitle(payload.title)
      setMovieUrl(payload.sourceUrl)
      setPlaybackUrl(payload.sourceUrl)
      setStatusMessage('Movie URL received from extension. Press Download to save offline.')
    }

    void refreshLibrary()
  }, [])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  function clearOfflineUrlIfNeeded(): void {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  function handleStartStreaming(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const trimmedUrl = movieUrl.trim()
    if (trimmedUrl.length === 0) {
      setErrorMessage('Add a movie URL first.')
      return
    }

    clearOfflineUrlIfNeeded()
    setPlaybackUrl(trimmedUrl)
    setIsOfflinePlayback(false)
    setStatusMessage('Streaming started. You can now download for offline viewing.')
    setErrorMessage('')
  }

  async function handleDownload(): Promise<void> {
    if (!playbackUrl || isOfflinePlayback) {
      setErrorMessage('Start streaming from an online URL before downloading.')
      return
    }

    setIsDownloading(true)
    setErrorMessage('')
    setStatusMessage('Downloading movie...')
    setProgress({ receivedBytes: 0, totalBytes: null })

    try {
      const result = await downloadMovie({
        url: playbackUrl,
        onProgress: (nextProgress) => {
          setProgress(nextProgress)
        },
      })

      const title = movieTitle.trim() || inferTitleFromUrl(playbackUrl)
      await saveMovie({
        title,
        sourceUrl: playbackUrl,
        mimeType: result.mimeType,
        sizeBytes: result.sizeBytes,
        blob: result.blob,
      })

      await refreshLibrary()
      setStatusMessage(`"${title}" was saved for offline playback.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setStatusMessage('')
    } finally {
      setIsDownloading(false)
    }
  }

  async function handlePlayOffline(movieId: string): Promise<void> {
    setErrorMessage('')
    setStatusMessage('')

    const movie = await getMovieById(movieId)
    if (!movie) {
      setErrorMessage('Movie could not be loaded from your offline library.')
      return
    }

    clearOfflineUrlIfNeeded()
    const objectUrl = URL.createObjectURL(movie.blob)
    objectUrlRef.current = objectUrl
    setPlaybackUrl(objectUrl)
    setMovieTitle(movie.title)
    setMovieUrl(movie.sourceUrl)
    setIsOfflinePlayback(true)
    setStatusMessage(`Playing "${movie.title}" from offline storage.`)
  }

  async function handleDelete(movieId: string): Promise<void> {
    await removeMovie(movieId)
    await refreshLibrary()
    setStatusMessage('Movie removed from offline library.')
  }

  async function handleExport(movieId: string): Promise<void> {
    const movie = await getMovieById(movieId)
    if (!movie) {
      setErrorMessage('Movie export failed because the file was not found.')
      return
    }

    const objectUrl = URL.createObjectURL(movie.blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = suggestFileName(movie.title, movie.mimeType)
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
    setStatusMessage(`Exported "${movie.title}" to your device.`)
  }

  return (
    <main className="app-shell">
      <header className="header">
        <h1>Offline Movie Vault</h1>
        <p>
          Stream from a direct video URL, then save locally for offline viewing in this browser.
        </p>
        <p className="legal-note">
          Use only media you own or content with explicit permission for downloading. DRM-protected
          streams are not supported.
        </p>
      </header>

      <section className="panel">
        <h2>1) Stream a movie</h2>
        <form onSubmit={handleStartStreaming} className="stream-form">
          <label>
            Movie title (optional)
            <input
              value={movieTitle}
              onChange={(event) => setMovieTitle(event.target.value)}
              placeholder="Example: My Documentary"
            />
          </label>
          <label>
            Direct video URL
            <input
              value={movieUrl}
              onChange={(event) => setMovieUrl(event.target.value)}
              placeholder="https://example.com/movie.mp4"
              required
            />
          </label>
          <button type="submit">Start streaming</button>
        </form>
      </section>

      <section className="panel">
        <div className="player-heading">
          <h2>2) Download while streaming</h2>
          <button onClick={() => void handleDownload()} disabled={isDownloading || !playbackUrl}>
            {isDownloading ? 'Downloading...' : 'Save for offline'}
          </button>
        </div>

        {playbackUrl ? (
          <video key={playbackUrl} controls className="player" src={playbackUrl} />
        ) : (
          <p className="muted">No movie loaded yet.</p>
        )}

        {isDownloading ? (
          <div className="progress">
            <p>
              Downloaded {formatBytes(progress.receivedBytes)}
              {progress.totalBytes ? ` of ${formatBytes(progress.totalBytes)}` : ''}
            </p>
            <progress
              value={percent ?? undefined}
              max={100}
              aria-label="Download progress"
            >
              {percent ?? 0}
            </progress>
            <p>{percent !== null ? `${percent}%` : 'Calculating size...'}</p>
          </div>
        ) : null}

        {statusMessage ? <p className="status success">{statusMessage}</p> : null}
        {errorMessage ? <p className="status error">{errorMessage}</p> : null}
      </section>

      <section className="panel">
        <h2>3) Offline library</h2>
        {library.length === 0 ? (
          <p className="muted">No saved movies yet.</p>
        ) : (
          <ul className="library">
            {library.map((movie) => (
              <li key={movie.id}>
                <div>
                  <p className="movie-title">{movie.title}</p>
                  <p className="movie-meta">
                    {formatBytes(movie.sizeBytes)} · saved {formatDate(movie.createdAt)}
                  </p>
                </div>
                <div className="movie-actions">
                  <button onClick={() => void handlePlayOffline(movie.id)}>Play offline</button>
                  <button onClick={() => void handleExport(movie.id)}>Export</button>
                  <button onClick={() => void handleDelete(movie.id)} className="danger">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
