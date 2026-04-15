# Offline Movie Vault (React + TypeScript + Chrome Extension)

Offline Movie Vault is a no-backend app that lets you:

1. stream a direct video URL in the browser,
2. save that movie to IndexedDB for offline playback,
3. manage a local library (play/export/delete),
4. send detected video URLs from a Chrome extension into the web app.

## Important limitations

- This project supports **only direct, downloadable media URLs**.
- DRM-protected streams (for example, Widevine-protected services) are not supported.
- Cross-origin rules still apply; if the source server blocks access, download will fail.
- Use only media you own or content where downloading is explicitly allowed.

## Web app setup

```bash
cd offline-movie-app
npm install
npm run dev
```

The app runs at:

- `http://localhost:5173`

## Chrome extension setup

The extension is in `chrome-extension/`.

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the folder:
   - `offline-movie-app/chrome-extension`

After loading:

- Open any page with a `<video>` element.
- Click the extension popup.
- Press **Scan current tab videos**.
- Select one URL, then:
  - **Open in web app** to send it to the React app.
  - **Direct download** to use Chrome's native download manager.

## Development commands

```bash
npm run dev
npm run build
npm run lint
```

## Architecture

- `src/lib/storage.ts`: IndexedDB layer for movie blobs and metadata
- `src/lib/download.ts`: streaming downloader with progress updates
- `src/App.tsx`: player, downloader, and offline library UI
- `public/sw.js`: service worker for app-shell caching
- `chrome-extension/*`: popup and background scripts for URL capture and handoff
