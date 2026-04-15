export interface DownloadResult {
  blob: Blob
  mimeType: string
  sizeBytes: number
}

export interface DownloadProgress {
  receivedBytes: number
  totalBytes: number | null
}

interface DownloadMovieOptions {
  url: string
  onProgress: (progress: DownloadProgress) => void
}

function parseTotalBytes(headerValue: string | null): number | null {
  if (!headerValue) {
    return null
  }

  const parsed = Number.parseInt(headerValue, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export async function downloadMovie({
  url,
  onProgress,
}: DownloadMovieOptions): Promise<DownloadResult> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download failed (${response.status} ${response.statusText}).`)
  }

  if (!response.body) {
    throw new Error('Streaming download is not supported by this response.')
  }

  const reader = response.body.getReader()
  const totalBytes = parseTotalBytes(response.headers.get('content-length'))
  const chunks: BlobPart[] = []
  let receivedBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    if (value) {
      const copy = new Uint8Array(value.byteLength)
      copy.set(value)
      chunks.push(copy)
      receivedBytes += value.byteLength
      onProgress({ receivedBytes, totalBytes })
    }
  }

  const headerMimeType = response.headers.get('content-type')
  const parsedMimeType = headerMimeType?.split(';')[0]
  const mimeType =
    parsedMimeType && parsedMimeType.length > 0 ? parsedMimeType : 'video/mp4'
  const blob = new Blob(chunks, { type: mimeType })

  return {
    blob,
    mimeType,
    sizeBytes: blob.size,
  }
}
