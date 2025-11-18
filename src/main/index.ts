import { app, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { setupSecureSession } from './security/session'
import { setupCertificatePinning } from './security/certificate-pinning'
import { registerIpcHandlers } from './ipc'

// Disable hardware acceleration for better compatibility
app.disableHardwareAcceleration()

// Enable sandbox for all renderers
app.enableSandbox()

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

/**
 * Create the main application window with security best practices
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until ready
    title: 'OneTimeSecret',
    webPreferences: {
      // Security: Enable context isolation
      contextIsolation: true,

      // Security: Enable sandbox
      sandbox: true,

      // Security: Disable node integration in renderer
      nodeIntegration: false,

      // Security: Disable web workers
      webviewTag: false,

      // Security: Disable remote module
      enableRemoteModule: false,

      // Security: Preload script for secure IPC
      preload: join(__dirname, '../preload/index.js'),

      // Security: Disable navigation
      navigateOnDragDrop: false,

      // Security: Disable experimental features
      experimentalFeatures: false,

      // Security: Same-origin policy
      webSecurity: true,

      // Security: Disable DevTools in production
      devTools: isDev,
    },
  })

  // Security: Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    // Only allow navigation to the app's own pages
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })

  // Security: Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  // Security: Disable zoom
  mainWindow.webContents.setZoomFactor(1.0)
  mainWindow.webContents.setVisualZoomLevelLimits(1, 1)

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Initialize the application with security measures
 */
async function initialize() {
  // Wait for app to be ready
  await app.whenReady()

  // Setup secure session with CSP
  setupSecureSession(session.defaultSession)

  // Setup certificate pinning for OTS API
  setupCertificatePinning(session.defaultSession)

  // Register IPC handlers
  registerIpcHandlers()

  // Create the main window
  createWindow()
}

// Security: Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Re-create window on macOS when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Security: Disable GPU in production for better security
if (!isDev) {
  app.commandLine.appendSwitch('disable-gpu')
  app.commandLine.appendSwitch('disable-software-rasterizer')
}

// Initialize the app
initialize().catch((error) => {
  console.error('Failed to initialize application:', error)
  app.quit()
})
