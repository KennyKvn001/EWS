const appUrlInput = document.getElementById('appUrlInput')
const saveAppUrlButton = document.getElementById('saveAppUrlButton')
const scanButton = document.getElementById('scanButton')
const openInVaultButton = document.getElementById('openInVaultButton')
const directDownloadButton = document.getElementById('directDownloadButton')
const videoList = document.getElementById('videoList')
const emptyState = document.getElementById('emptyState')
const statusMessage = document.getElementById('statusMessage')

let candidates = []
let selectedCandidateId = null

function setStatus(message) {
  statusMessage.textContent = message
}

function getSelectedCandidate() {
  return candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null
}

function updateActionButtons() {
  const hasSelection = getSelectedCandidate() !== null
  openInVaultButton.disabled = !hasSelection
  directDownloadButton.disabled = !hasSelection
}

function createCandidateLabel(candidate) {
  return candidate.label && candidate.label.length > 0
    ? `${candidate.label} — ${candidate.url}`
    : candidate.url
}

function renderCandidates() {
  videoList.innerHTML = ''

  if (candidates.length === 0) {
    emptyState.hidden = false
    selectedCandidateId = null
    updateActionButtons()
    return
  }

  emptyState.hidden = true
  const fragment = document.createDocumentFragment()

  candidates.forEach((candidate) => {
    const item = document.createElement('li')
    const label = document.createElement('label')
    const radio = document.createElement('input')
    const text = document.createElement('span')

    radio.type = 'radio'
    radio.name = 'video-choice'
    radio.value = candidate.id
    radio.checked = selectedCandidateId === candidate.id
    radio.addEventListener('change', () => {
      selectedCandidateId = candidate.id
      updateActionButtons()
    })

    text.textContent = createCandidateLabel(candidate)
    label.append(radio, text)
    item.append(label)
    fragment.append(item)
  })

  videoList.append(fragment)
  updateActionButtons()
}

function normalizeAppUrl(rawUrl) {
  const fallbackUrl = 'http://localhost:5173'
  const source = rawUrl && rawUrl.length > 0 ? rawUrl : fallbackUrl
  return source.endsWith('/') ? source.slice(0, -1) : source
}

async function readSavedAppUrl() {
  const data = await chrome.storage.sync.get('offlineMovieAppUrl')
  const value = typeof data.offlineMovieAppUrl === 'string' ? data.offlineMovieAppUrl : ''
  appUrlInput.value = value || 'http://localhost:5173'
}

async function saveAppUrl() {
  const normalized = normalizeAppUrl(appUrlInput.value.trim())
  await chrome.storage.sync.set({ offlineMovieAppUrl: normalized })
  appUrlInput.value = normalized
  setStatus('Web app URL saved.')
}

async function getCurrentTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  const activeTab = tabs[0]
  if (!activeTab || typeof activeTab.id !== 'number') {
    throw new Error('No active tab found.')
  }

  return activeTab.id
}

function dedupeCandidates(rawCandidates) {
  const unique = new Map()
  rawCandidates.forEach((candidate) => {
    if (typeof candidate.url !== 'string') {
      return
    }

    if (!candidate.url.startsWith('http://') && !candidate.url.startsWith('https://')) {
      return
    }

    if (!unique.has(candidate.url)) {
      unique.set(candidate.url, {
        id: crypto.randomUUID(),
        url: candidate.url,
        label: typeof candidate.label === 'string' ? candidate.label : '',
      })
    }
  })

  return Array.from(unique.values())
}

async function scanVideos() {
  setStatus('Scanning videos...')
  const tabId = await getCurrentTabId()
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const found = []
      const videos = Array.from(document.querySelectorAll('video'))

      videos.forEach((video, index) => {
        const title = video.getAttribute('title') || `Video ${index + 1}`
        const possibleUrls = [video.currentSrc, video.src]
        const sourceNodes = Array.from(video.querySelectorAll('source'))
        sourceNodes.forEach((source) => possibleUrls.push(source.src))

        possibleUrls.forEach((url) => {
          if (typeof url === 'string' && url.length > 0) {
            found.push({ url, label: title })
          }
        })
      })

      return found
    },
  })

  const firstResult = results[0]
  const extracted = Array.isArray(firstResult?.result) ? firstResult.result : []
  candidates = dedupeCandidates(extracted)
  selectedCandidateId = candidates.length > 0 ? candidates[0].id : null
  renderCandidates()
  setStatus(
    candidates.length > 0
      ? `Found ${candidates.length} playable video URL(s).`
      : 'No direct video URLs were found on this tab.',
  )
}

async function openInVault() {
  const selected = getSelectedCandidate()
  if (!selected) {
    return
  }

  const appBaseUrl = normalizeAppUrl(appUrlInput.value.trim())
  const response = await chrome.runtime.sendMessage({
    type: 'open-in-vault',
    appBaseUrl,
    videoUrl: selected.url,
    title: selected.label,
  })

  if (response && response.ok) {
    setStatus('Opened video in Offline Movie Vault.')
  } else {
    setStatus(response?.error ?? 'Failed to open web app.')
  }
}

async function directDownload() {
  const selected = getSelectedCandidate()
  if (!selected) {
    return
  }

  const response = await chrome.runtime.sendMessage({
    type: 'direct-download',
    videoUrl: selected.url,
    title: selected.label,
  })

  if (response && response.ok) {
    setStatus('Download started by Chrome.')
  } else {
    setStatus(response?.error ?? 'Could not start download.')
  }
}

saveAppUrlButton.addEventListener('click', () => {
  void saveAppUrl()
})

scanButton.addEventListener('click', () => {
  void scanVideos().catch((error) => {
    setStatus(error instanceof Error ? error.message : 'Video scan failed.')
  })
})

openInVaultButton.addEventListener('click', () => {
  void openInVault()
})

directDownloadButton.addEventListener('click', () => {
  void directDownload()
})

void readSavedAppUrl()
updateActionButtons()
