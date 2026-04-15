function normalizeAppUrl(rawAppUrl) {
  const withFallback = rawAppUrl && rawAppUrl.length > 0 ? rawAppUrl : 'http://localhost:5173'
  return withFallback.endsWith('/') ? withFallback.slice(0, -1) : withFallback
}

function sanitizeFileName(title) {
  const safeTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim()
  if (safeTitle.length === 0) {
    return 'offline-movie.mp4'
  }

  return `${safeTitle}.mp4`
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== 'object') {
    sendResponse({ ok: false, error: 'Invalid message payload.' })
    return undefined
  }

  if (message.type === 'open-in-vault') {
    const appBaseUrl = normalizeAppUrl(message.appBaseUrl)
    const params = new URLSearchParams({
      src: message.videoUrl,
      title: message.title ?? '',
    })

    chrome.tabs
      .create({ url: `${appBaseUrl}/?${params.toString()}` })
      .then(() => sendResponse({ ok: true }))
      .catch((error) =>
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : 'Failed to open web app tab.',
        }),
      )
    return true
  }

  if (message.type === 'direct-download') {
    const filename = sanitizeFileName(message.title ?? '')
    chrome.downloads
      .download({
        url: message.videoUrl,
        filename,
        saveAs: true,
      })
      .then(() => sendResponse({ ok: true }))
      .catch((error) =>
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : 'Direct download failed.',
        }),
      )
    return true
  }

  sendResponse({ ok: false, error: 'Unsupported message type.' })
  return undefined
})
