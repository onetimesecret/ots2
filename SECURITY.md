# Security Policy

## Security Model

Onetimesecret Desktop is built with security as the highest priority, implementing multiple layers of defense:

### Trust Boundaries

1. **Frontend ↔ Backend**: All IPC communication validated in Rust
2. **Backend ↔ API**: HTTPS-only with certificate validation
3. **Storage**: Platform-specific secure credential storage

### Security Features

- **Tauri Capability System**: Granular permission control
- **Content Security Policy**: Prevents XSS and code injection
- **Input Validation**: All user inputs validated before processing
- **Secure Storage**: API keys stored in OS keychain
- **Memory Safety**: Rust prevents memory-related vulnerabilities
- **HTTPS Enforcement**: All API communication over HTTPS

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### Private Reporting

To report a security vulnerability:

1. **Email**: Send details to security@onetimesecret.com
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Encrypt** (optional): Use PGP for sensitive information

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Updates**: Every 7 days on progress
- **Resolution**: Timeline depends on severity

### Disclosure Policy

- We follow coordinated disclosure
- Allow 90 days for fix before public disclosure
- Credit given to reporters (if desired)
- Security advisories published when fixed

## Security Best Practices for Users

### Installation
- Download only from official sources
- Verify checksums of downloaded files
- Keep the application updated

### Configuration
- Use strong, unique API keys
- Never share your API credentials
- Use passphrase protection for sensitive secrets
- Set appropriate TTL values

### Usage
- Don't store credentials in the app longer than necessary
- Review permissions requested by the app
- Use on trusted networks
- Keep your OS updated

## Security Checklist for Developers

Before deploying:

- [ ] CSP configured restrictively
- [ ] Capabilities use principle of least privilege
- [ ] All IPC commands validate inputs
- [ ] API keys stored securely
- [ ] HTTPS enforced for API calls
- [ ] No sensitive data in logs
- [ ] Dependencies audited (`npm audit`, `cargo audit`)
- [ ] Security testing completed
- [ ] Code review performed

## Known Security Considerations

### Platform Keychain Access

The application uses platform-specific keychains:
- **macOS**: Keychain Access
- **Windows**: Credential Manager
- **Linux**: Secret Service (GNOME Keyring, KWallet)

If keychain access fails:
1. Grant permission when prompted
2. Ensure keychain service is running
3. Check system logs for errors

### Network Security

All API communication:
- Uses HTTPS with certificate validation
- Includes Basic Authentication headers
- Times out after 30 seconds
- Uses rustls for TLS (not OpenSSL)

### Data Storage

- API credentials: Platform keychain only
- Configuration: Platform keychain
- No secrets stored in:
  - LocalStorage
  - SessionStorage
  - Plain text files
  - Application logs

## Vulnerability Disclosure Timeline

Example timeline for critical vulnerabilities:
1. **Day 0**: Vulnerability reported
2. **Day 2**: Acknowledged and assessed
3. **Day 7**: Fix in development
4. **Day 14**: Fix tested
5. **Day 21**: Patch released
6. **Day 28**: Public disclosure

## Security Updates

Security updates are released:
- Immediately for critical vulnerabilities
- Within 7 days for high severity
- Within 30 days for moderate severity
- With regular releases for low severity

## Contact

- **Security Email**: security@onetimesecret.com
- **General Issues**: https://github.com/onetimesecret/ots2/issues
- **Project Website**: https://onetimesecret.com

## Attribution

We thank the following security researchers:
- *None yet - be the first!*

## Additional Resources

- [Tauri Security Guide](https://v2.tauri.app/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Rust Security](https://www.rust-lang.org/policies/security)
- [Vue.js Security](https://vuejs.org/guide/best-practices/security.html)

---

**Thank you for helping keep Onetimesecret Desktop secure!**
