const DATABASE_NAME = 'offline_movie_vault'
const DATABASE_VERSION = 1
const MOVIE_STORE_NAME = 'movies'

export interface StoredMovie {
  id: string
  title: string
  sourceUrl: string
  mimeType: string
  sizeBytes: number
  createdAt: string
  blob: Blob
}

export type StoredMovieSummary = Omit<StoredMovie, 'blob'>

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(MOVIE_STORE_NAME)) {
        database.createObjectStore(MOVIE_STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('Unable to open local movie database.'))
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  executor: (
    store: IDBObjectStore,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
  ) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((database) => {
        const transaction = database.transaction(MOVIE_STORE_NAME, mode)
        const store = transaction.objectStore(MOVIE_STORE_NAME)

        transaction.oncomplete = () => database.close()
        transaction.onerror = () => {
          reject(transaction.error ?? new Error('Database transaction failed.'))
          database.close()
        }
        transaction.onabort = () => {
          reject(transaction.error ?? new Error('Database transaction aborted.'))
          database.close()
        }

        executor(store, resolve, reject)
      })
      .catch((error: unknown) => {
        reject(error)
      })
  })
}

export async function saveMovie(
  movie: Omit<StoredMovie, 'id' | 'createdAt'>,
): Promise<string> {
  const id = crypto.randomUUID()
  const record: StoredMovie = {
    ...movie,
    id,
    createdAt: new Date().toISOString(),
  }

  await runTransaction<void>('readwrite', (store, resolve, reject) => {
    const request = store.add(record)
    request.onsuccess = () => resolve()
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to save movie offline.'))
  })

  return id
}

export async function getMovieById(id: string): Promise<StoredMovie | null> {
  return runTransaction<StoredMovie | null>('readonly', (store, resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => {
      const value = request.result
      resolve(value ?? null)
    }
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to load movie details.'))
  })
}

export async function getAllMovieSummaries(): Promise<StoredMovieSummary[]> {
  return runTransaction<StoredMovieSummary[]>('readonly', (store, resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => {
      const results = (request.result as StoredMovie[]).map(({ blob, ...summary }) => {
        void blob
        return summary
      })
      results.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      )
      resolve(results)
    }
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to load offline library.'))
  })
}

export async function removeMovie(id: string): Promise<void> {
  await runTransaction<void>('readwrite', (store, resolve, reject) => {
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to delete movie.'))
  })
}
