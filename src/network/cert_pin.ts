/**
 * SSL Certificate Pinning (Optional)
 *
 * Note: One-Time Secret uses Let's Encrypt certificates which rotate regularly.
 * Certificate pinning is optional and disabled by default.
 *
 * For production use, consider:
 * 1. Pinning to the CA certificate (Let's Encrypt)
 * 2. Implementing certificate rotation handling
 * 3. Fallback mechanisms for certificate updates
 */

import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { NetworkError } from '@/core/error';
import { ENV } from '@/core/env';

/**
 * SHA-256 fingerprints of trusted certificates
 * These should be updated when certificates rotate
 */
const TRUSTED_FINGERPRINTS: string[] = [
  // Example Let's Encrypt X3 intermediate CA (base64-encoded SHA-256)
  // 'YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=',

  // Add actual certificate fingerprints here
  // You can get them using:
  // openssl s_client -connect onetimesecret.com:443 | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
];

/**
 * Validates certificate fingerprint
 * @param fingerprint - Certificate fingerprint to validate
 * @returns true if certificate is trusted
 */
function validateCertificateFingerprint(fingerprint: string): boolean {
  if (TRUSTED_FINGERPRINTS.length === 0) {
    // No fingerprints configured - skip validation
    return true;
  }

  return TRUSTED_FINGERPRINTS.includes(fingerprint);
}

/**
 * Attaches certificate pinning interceptor to Axios instance
 *
 * Note: This is a placeholder implementation.
 * In a real implementation, you would need to:
 * 1. Access the TLS connection details (requires native code)
 * 2. Extract the certificate fingerprint
 * 3. Validate against trusted fingerprints
 *
 * Tauri doesn't expose TLS connection details directly,
 * so this would require a custom Tauri command.
 */
export function attachCertificatePinning(axios: AxiosInstance): void {
  if (!ENV.ENABLE_CERT_PINNING) {
    console.info('Certificate pinning is disabled');
    return;
  }

  console.warn(
    'Certificate pinning is enabled but not fully implemented. ' +
    'This requires native Tauri commands to access TLS connection details.',
  );

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // TODO: Implement certificate validation using Tauri commands
      // This would require:
      // 1. A custom Tauri command to get certificate info
      // 2. Certificate fingerprint extraction
      // 3. Validation against TRUSTED_FINGERPRINTS

      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if error is certificate-related
      if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return Promise.reject(
          new NetworkError(
            'SSL certificate validation failed. This could indicate a security issue.',
            error.response?.status,
          ),
        );
      }

      return Promise.reject(error);
    },
  );
}

/**
 * Placeholder for future implementation
 * This would be a Tauri command to get certificate fingerprint
 */
export async function getCertificateFingerprint(url: string): Promise<string> {
  // TODO: Implement using Tauri command
  console.warn('getCertificateFingerprint not implemented:', url);
  return '';
}

/**
 * Update trusted certificate fingerprints
 * Should be called when certificates are expected to rotate
 */
export function updateTrustedFingerprints(fingerprints: string[]): void {
  TRUSTED_FINGERPRINTS.length = 0;
  TRUSTED_FINGERPRINTS.push(...fingerprints);
  console.info(`Updated trusted certificate fingerprints: ${fingerprints.length} entries`);
}
