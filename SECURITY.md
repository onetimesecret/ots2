# Security Policy

## Overview

OneTimeSecret Desktop is built with security as a top priority. This document outlines the security measures implemented in the application and provides guidance for security researchers and developers.

## Security Features

### 1. OS-Level Encryption

All sensitive credentials (API tokens, usernames) are encrypted using OS-level security features:

- **Windows**: Data Protection API (DPAPI)
- **macOS**: Keychain Services
- **Linux**: Secret Service API (libsecret)

This is implemented via Electron's `safeStorage` API, ensuring credentials are encrypted at rest using the same mechanisms trusted by the operating system.

### 2. Process Isolation

The application uses Electron's security best practices:

- **Context Isolation**: Enabled for all renderer processes
- **Sandbox**: All renderers run in a sandboxed environment
- **Node Integration**: Disabled in renderer processes
- **Remote Module**: Disabled entirely

This ensures that even if an attacker compromises the renderer process, they cannot access Node.js APIs or the main process directly.

### 3. Content Security Policy (CSP)

A strict Content Security Policy is enforced:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'self' https://onetimesecret.dev;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

This prevents:
- Cross-Site Scripting (XSS) attacks
- Injection of malicious scripts
- Loading resources from untrusted origins
- Clickjacking attacks

### 4. Certificate Pinning

Certificate pinning is implemented for API connections to prevent Man-in-the-Middle (MITM) attacks. The application validates:

1. Standard certificate verification (chain of trust)
2. Certificate fingerprint against known pins

If either check fails, the connection is rejected.

### 5. Input Validation

All user inputs and API responses are validated using:

- **TypeScript**: Compile-time type checking
- **Zod**: Runtime schema validation
- **Sanitization**: HTML and special characters are sanitized

This prevents:
- Injection attacks (SQL, Command, XSS)
- Type confusion vulnerabilities
- Malformed data processing

### 6. Network Security

- **HTTPS Only**: All API communication uses HTTPS
- **No Mixed Content**: HTTP resources are blocked
- **Request Validation**: All requests are validated before sending
- **Retry Logic**: Exponential backoff prevents DoS scenarios
- **Timeout**: 30-second timeout prevents hanging requests

### 7. Secure IPC Communication

Communication between processes uses a secure IPC bridge:

- Type-safe methods exposed via `contextBridge`
- Input validation on all IPC handlers
- No direct access to Node.js APIs from renderer
- Result wrapping with success/error states

## Threat Model

### In Scope

The following threats are actively mitigated:

1. **Credential Theft**: Encryption at rest protects stored credentials
2. **MITM Attacks**: Certificate pinning prevents interception
3. **Code Injection**: CSP and input validation prevent injection
4. **Process Compromise**: Sandboxing limits impact of renderer compromise
5. **Data Exfiltration**: Network restrictions limit unauthorized connections

### Out of Scope

The following are not protected against:

1. **Physical Access**: If an attacker has physical access to an unlocked machine, they may access running application
2. **Keyloggers**: System-level keyloggers can capture passphrases as typed
3. **Screen Recording**: Screen capture malware can record displayed secrets
4. **OS Compromise**: If the OS is compromised, encryption keys may be accessible
5. **Supply Chain**: We trust npm packages and Electron (review dependencies regularly)

## Security Best Practices for Users

1. **Keep Software Updated**: Install updates promptly for security patches
2. **Use Strong Passphrases**: Add extra protection to sensitive secrets
3. **Verify Recipients**: Double-check recipient information before sharing
4. **Lock Your Device**: Enable screen lock when stepping away
5. **Verify Downloads**: Only download from official sources
6. **Review Permissions**: Understand what the application can access

## Security Best Practices for Developers

### Code Review Checklist

- [ ] All user inputs are validated and sanitized
- [ ] Sensitive data is not logged or exposed in errors
- [ ] API responses are validated with Zod schemas
- [ ] No eval() or Function() usage
- [ ] No innerHTML usage (use textContent)
- [ ] Dependencies are audited (`npm audit`)
- [ ] TypeScript strict mode is enabled
- [ ] Error messages don't leak sensitive information

### Dependency Management

```bash
# Audit dependencies regularly
npm audit

# Fix vulnerabilities
npm audit fix

# For additional scanning
npx snyk test
```

### Secure Coding Guidelines

1. **Never Store Secrets in Code**: Use environment variables or secure storage
2. **Validate All Inputs**: Trust nothing from users or external sources
3. **Use Parameterized Queries**: Prevent SQL injection (if database is added)
4. **Sanitize Output**: Prevent XSS when displaying user data
5. **Handle Errors Safely**: Don't expose stack traces or sensitive info
6. **Use HTTPS Everywhere**: No HTTP connections for sensitive data
7. **Implement Rate Limiting**: Prevent brute force attacks
8. **Log Security Events**: Monitor for suspicious activity

## Known Limitations

1. **Certificate Pinning Maintenance**: Pins must be updated when certificates rotate
2. **Platform-Specific Encryption**: Encryption availability depends on OS configuration
3. **Memory Security**: Secrets in memory could be accessed via memory dumps
4. **Update Mechanism**: No built-in auto-update (manual updates required)

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please follow responsible disclosure:

1. **Do Not** open a public GitHub issue
2. Email details to: [Create an issue with "Security:" prefix]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will:
- Acknowledge receipt within 48 hours
- Investigate and validate the issue
- Develop and test a fix
- Release a patch and credit you (if desired)

## Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2024-11 | Internal | Initial security review | Complete |

## Compliance

This application follows:

- OWASP Top 10 mitigation strategies
- Electron Security Best Practices
- CWE (Common Weakness Enumeration) guidelines

## Security Resources

- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## License

This security policy is licensed under CC BY 4.0.

---

Last Updated: 2024-11
