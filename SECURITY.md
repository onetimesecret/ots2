# Security Policy

## Security Architecture

OneTimeSecret Desktop is built with security as the top priority. This document outlines our security practices and how to report vulnerabilities.

## Reporting Security Vulnerabilities

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them responsibly:

1. Email security concerns to: security@onetimesecret.dev
2. Include detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

You should receive a response within 48 hours. We appreciate responsible disclosure.

## Security Features

### Platform-Native Secure Storage

- **Windows**: Credentials stored in Windows Credential Manager (encrypted with DPAPI)
- **macOS**: Credentials stored in macOS Keychain (encrypted with Keychain Services)
- **Linux**: Credentials stored via Secret Service API (encrypted with libsecret)

### Content Security Policy (CSP)

Strict CSP prevents XSS and code injection:

```json
{
  "default-src": "'self'",
  "connect-src": "'self' https://onetimesecret.dev",
  "script-src": "'self' 'unsafe-inline'",
  "style-src": "'self' 'unsafe-inline'"
}
```

### Backend-Only API Communication

- All API calls handled in Rust backend
- Frontend has no direct network access
- Type-safe IPC between frontend and backend
- Certificate validation on all HTTPS connections

### Minimal Permissions

The application uses Tauri's capability system with minimal permissions:

- Network access only to `https://onetimesecret.dev`
- No filesystem access beyond app data directory
- No shell command execution
- Limited window operations

See `src-tauri/capabilities/main-capability.json` for full details.

## Security Best Practices for Contributors

### Code Review Checklist

Before submitting security-sensitive code:

- [ ] No hardcoded credentials or API keys
- [ ] All sensitive operations in Rust backend
- [ ] Input validation on all user inputs
- [ ] No logging of sensitive information
- [ ] Proper error handling (no information leakage)
- [ ] Dependencies are up-to-date
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No command injection vulnerabilities

### Common Vulnerabilities to Avoid

#### ❌ Don't Do This

```typescript
// BAD: Direct API call from frontend
const response = await fetch('https://onetimesecret.dev/api/v2/share', {
  method: 'POST',
  body: JSON.stringify({ secret: userInput })
})
```

```typescript
// BAD: Storing secrets in localStorage
localStorage.setItem('apiKey', apiKey)
```

```rust
// BAD: String interpolation in commands
let cmd = format!("echo {}", user_input);
Command::new("sh").arg("-c").arg(cmd).spawn();
```

#### ✅ Do This Instead

```typescript
// GOOD: Use Tauri commands
const result = await invoke('create_secret', {
  secret: userInput
})
```

```rust
// GOOD: Use secure storage
use tauri_plugin_secure_storage::SecureStorageExt;
app.secure_storage().set("apiKey", api_key);
```

```rust
// GOOD: Avoid shell commands, use safe APIs
// If necessary, properly sanitize and validate inputs
```

## Dependency Management

### Keeping Dependencies Updated

Run these commands regularly:

```bash
# Update npm packages
npm update
npm audit

# Update Rust packages
cd src-tauri
cargo update
cargo audit
```

### Dependency Review

- Review all dependency changes in pull requests
- Use `npm audit` and `cargo audit` to check for known vulnerabilities
- Pin critical dependencies to specific versions
- Verify package integrity

## Secure Development Environment

### Recommendations

1. **Keep your development environment updated**:
   - Latest stable Node.js
   - Latest stable Rust
   - Updated OS security patches

2. **Use environment variables** for sensitive configuration:
   ```bash
   # Never commit .env files
   echo ".env" >> .gitignore
   ```

3. **Enable security tools**:
   - Code analysis tools
   - Dependency vulnerability scanners
   - Git hooks for pre-commit checks

## Threat Model

### Assets Protected

1. User secrets (one-time shared data)
2. API credentials and settings
3. Application integrity

### Threats Mitigated

- **Man-in-the-Middle (MITM)**: HTTPS with certificate validation
- **XSS Attacks**: Strict CSP, no innerHTML usage
- **Code Injection**: Type-safe IPC, input validation
- **Credential Theft**: Platform-native secure storage
- **Privilege Escalation**: Minimal permission model

### Known Limitations

- **Network Security**: Relies on HTTPS/TLS for API communication
- **Local Attacks**: Cannot protect against malware with root/admin access
- **Social Engineering**: Cannot prevent users from sharing secrets insecurely

## Incident Response

In case of a security incident:

1. **Disclosure**: Responsible disclosure via email
2. **Assessment**: Evaluate impact and severity
3. **Fix**: Develop and test patch
4. **Release**: Security update with advisory
5. **Notification**: Inform users of the issue and update

## Security Checklist for Releases

Before each release:

- [ ] Run `npm audit` and fix all high/critical issues
- [ ] Run `cargo audit` and fix all vulnerabilities
- [ ] Review all dependency updates
- [ ] Test on all supported platforms
- [ ] Verify CSP is correctly configured
- [ ] Check that no secrets are logged
- [ ] Ensure debug features are disabled in production
- [ ] Review all permissions in capabilities
- [ ] Test secure storage on all platforms

## Compliance and Standards

This project follows:

- OWASP Top 10 security guidelines
- Tauri Security Best Practices
- Rust Security Guidelines
- Principle of Least Privilege

## Security Audit History

- **2025-11**: Initial security architecture review
- Regular updates will be documented here

## Contact

For security concerns: security@onetimesecret.dev

For general questions: GitHub Issues

---

**Last Updated**: November 2025
