import { Session } from 'electron'

/**
 * Setup secure session with Content Security Policy and other security headers
 */
export function setupSecureSession(session: Session): void {
  // Content Security Policy
  session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            // Default: Only allow content from same origin
            "default-src 'self'",
            // Scripts: Only from self (no inline scripts for security)
            "script-src 'self'",
            // Styles: Allow self and inline styles (needed for Vue)
            "style-src 'self' 'unsafe-inline'",
            // Images: Allow self and data URIs
            "img-src 'self' data:",
            // Fonts: Only from self
            "font-src 'self'",
            // Connect: Allow API calls to OTS
            "connect-src 'self' https://onetimesecret.dev",
            // Frames: Disallow all frames
            "frame-src 'none'",
            // Objects: Disallow all plugins
            "object-src 'none'",
            // Base: Restrict base URI
            "base-uri 'self'",
            // Forms: Only allow form submission to self
            "form-action 'self'",
            // Upgrade insecure requests
            'upgrade-insecure-requests',
          ].join('; '),
        ],
        // Additional security headers
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'X-XSS-Protection': ['1; mode=block'],
        'Referrer-Policy': ['no-referrer'],
        'Permissions-Policy': ['geolocation=(), microphone=(), camera=()'],
      },
    })
  })

  // Clear cache on startup for security
  session.clearCache()

  // Disable web SQL for security
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    // Deny all permission requests by default
    callback(false)
  })

  // Block insecure content
  session.webRequest.onBeforeRequest((details, callback) => {
    const url = new URL(details.url)

    // Block non-HTTPS requests (except localhost in dev)
    if (
      url.protocol !== 'https:' &&
      url.protocol !== 'file:' &&
      url.protocol !== 'devtools:' &&
      !url.hostname.includes('localhost') &&
      !url.hostname.includes('127.0.0.1')
    ) {
      callback({ cancel: true })
      return
    }

    callback({ cancel: false })
  })
}
