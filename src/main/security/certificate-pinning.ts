import { Session } from 'electron'
import * as crypto from 'crypto'

/**
 * Certificate pins for onetimesecret.dev
 * These should be updated periodically or fetched from a trusted source
 *
 * To get the current certificate fingerprint:
 * openssl s_client -connect onetimesecret.dev:443 -servername onetimesecret.dev < /dev/null 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
 */
const CERTIFICATE_PINS: Record<string, string[]> = {
  'onetimesecret.dev': [
    // Primary certificate pin (example - should be updated with actual pin)
    // Format: SHA256 fingerprint without colons
    // This is a placeholder and should be updated with the actual certificate fingerprint
  ],
}

/**
 * Setup certificate pinning for the OTS API
 * This helps prevent MITM attacks by ensuring we only trust specific certificates
 */
export function setupCertificatePinning(session: Session): void {
  session.setCertificateVerifyProc((request, callback) => {
    const { hostname, certificate, verificationResult } = request

    // First, check if the standard verification passed
    if (verificationResult !== 'net::OK') {
      console.error(`Certificate verification failed for ${hostname}: ${verificationResult}`)
      callback(-2) // Reject
      return
    }

    // Check if we have pins for this hostname
    const pins = CERTIFICATE_PINS[hostname]
    if (!pins || pins.length === 0) {
      // No pins configured for this host, accept if standard verification passed
      callback(0) // Accept
      return
    }

    // Get the certificate fingerprint
    const fingerprint = getCertificateFingerprint(certificate.data)

    // Check if the fingerprint matches any of our pins
    const isPinned = pins.some((pin) => {
      return fingerprint.toLowerCase() === pin.toLowerCase()
    })

    if (isPinned) {
      callback(0) // Accept
    } else {
      console.error(`Certificate pin mismatch for ${hostname}`)
      console.error(`Expected one of: ${pins.join(', ')}`)
      console.error(`Got: ${fingerprint}`)
      callback(-2) // Reject
    }
  })
}

/**
 * Calculate SHA256 fingerprint of a certificate
 */
function getCertificateFingerprint(certData: Buffer): string {
  const hash = crypto.createHash('sha256')
  hash.update(certData)
  return hash.digest('hex').toUpperCase()
}

/**
 * Utility function to fetch and log the current certificate fingerprint
 * This can be used during development to get the fingerprint for pinning
 */
export function logCertificateFingerprint(hostname: string): void {
  const https = require('https')

  const options = {
    hostname,
    port: 443,
    method: 'GET',
    rejectUnauthorized: true,
  }

  const req = https.request(options, (res: any) => {
    const cert = res.socket.getPeerCertificate()
    if (cert && cert.raw) {
      const fingerprint = getCertificateFingerprint(cert.raw)
      console.log(`Certificate fingerprint for ${hostname}:`)
      console.log(fingerprint)
    }
  })

  req.on('error', (error: Error) => {
    console.error(`Error fetching certificate for ${hostname}:`, error)
  })

  req.end()
}
