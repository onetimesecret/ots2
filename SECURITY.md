# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Features

OneTimeSecret Desktop implements multiple layers of security:

### 1. Platform-Native Secure Storage
- **Windows:** Credential Manager (Data Protection API)
- **macOS:** Keychain Services
- **Linux:** Secret Service API (libsecret)
- **Never** stores credentials in plaintext
- **Never** uses localStorage for sensitive data

### 2. Content Security Policy (CSP)
- Strict CSP headers prevent XSS and injection attacks
- No inline scripts or eval()
- Limited external resource loading
- Frame-ancestors set to 'none'

### 3. Capability-Based Permissions
- Minimal permission scope (principle of least privilege)
- Explicit capability definitions in `capabilities/main-capability.json`
- No unnecessary system access

### 4. Network Security
- HTTPS-only API communication enforced
- TLS certificate validation enabled
- Request timeouts configured
- Connection retry logic with exponential backoff

### 5. Input Validation
- Client-side validation in Vue components
- Server-side validation in Rust backend
- URL parsing and validation
- Type safety throughout (TypeScript + Rust)

### 6. Error Handling
- No sensitive data in error messages
- Proper error propagation using Result types
- User-friendly error messages without information leakage
- Logging without exposing credentials or secrets

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to the maintainers privately:

1. **Email:** [Contact repository owner for security email]
2. **Subject:** `[SECURITY] OneTimeSecret Desktop - [Brief Description]`

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., XSS, credential exposure, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue and potential attack scenarios
- Any suggested fixes

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next release cycle

### Disclosure Policy

We follow a coordinated disclosure process:

1. **Report received** - We acknowledge receipt and begin investigation
2. **Validation** - We confirm the vulnerability and assess severity
3. **Fix development** - We develop and test a fix
4. **Release preparation** - We prepare a security release
5. **Public disclosure** - After the fix is released, we publish details

We ask that you:
- Give us reasonable time to fix the issue before public disclosure
- Do not exploit the vulnerability
- Do not access, modify, or delete data that doesn't belong to you

## Security Best Practices for Users

### Installation
1. Download only from official sources
2. Verify code signatures when available
3. Review permissions requested during installation

### Configuration
1. Use strong, unique API keys
2. Never share your API credentials
3. Enable system security features (Firewall, antivirus)

### Usage
1. Keep the application updated
2. Use passphrase protection for sensitive secrets
3. Set appropriate TTL values (shorter is more secure)
4. Review secrets before sharing
5. Log out when finished

### What We Store Securely
- OneTimeSecret API credentials (username + API key)
- API endpoint URL

### What We NEVER Store
- Secret content (plaintext or encrypted)
- Secret passphrases
- Retrieved secret values
- Any data in localStorage or plain files

## Security Audit History

| Date       | Auditor | Scope | Findings | Status |
|------------|---------|-------|----------|--------|
| 2025-11-17 | Internal | Initial release | See PR_REVIEW.md | ✅ Addressed |

## Dependencies

We regularly audit dependencies for known vulnerabilities:

- **Frontend:** `npm audit` run on every commit
- **Backend:** `cargo audit` run weekly
- **Automated:** GitHub Actions workflows monitor dependencies

To check dependencies yourself:
```bash
# Frontend
npm audit

# Backend
cd src-tauri
cargo audit
```

## Security Checklist for Contributors

Before submitting a PR, ensure:

- [ ] No secrets or credentials committed
- [ ] Input validation on all user inputs
- [ ] Error messages don't leak sensitive information
- [ ] No unnecessary permissions added
- [ ] Dependencies are up-to-date and audited
- [ ] CSP rules not weakened
- [ ] Secure storage used for sensitive data
- [ ] All API calls use HTTPS
- [ ] Code follows security best practices
- [ ] Security review completed

## Known Limitations

### Current Scope
This application is designed for:
- Secure credential storage
- OneTimeSecret API interaction
- Desktop environments (not mobile)

### Not Designed For
- Secret generation (use OneTimeSecret service)
- Long-term secret storage
- Multi-user/multi-account scenarios
- Offline secret storage

## Security Updates

Security updates will be:
- Released as soon as possible after discovery
- Announced in CHANGELOG.md
- Tagged with severity level
- Accompanied by upgrade instructions

Subscribe to releases on GitHub to stay informed.

## Compliance

This application:
- Uses industry-standard encryption (platform-native)
- Follows OWASP security guidelines
- Implements defense in depth
- Adheres to principle of least privilege
- Maintains minimal attack surface

## Questions?

For security questions (non-vulnerabilities):
- Open a GitHub Discussion
- Tag with 'security' label

For security concerns or vulnerabilities:
- Follow the reporting process above
- Do not create public issues

## Acknowledgments

We thank the security researchers and contributors who help keep this project secure.

---

**Last Updated:** 2025-11-17
**Version:** 0.1.0
