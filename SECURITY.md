# Security Policy

## Reporting a Vulnerability

**DO NOT** open public GitHub issues for security vulnerabilities.

### Reporting Process

1. **Encrypt your report** using age encryption:

   ```bash
   # Install age: https://github.com/FiloSottile/age
   # Encrypt your report
   echo "Your vulnerability report here" | \
     age -r age1234... > vulnerability.txt.age
   ```

   Public key: `age1yubikey1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0` (placeholder - replace with actual)

2. **Send encrypted report** to: security@onetimesecret.com

3. **Include**:
   - Vulnerability description
   - Steps to reproduce
   - Impact assessment
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Status updates**: Every 14 days
- **Disclosure timeline**: 90 days (negotiable)

### Disclosure Policy

We follow **coordinated disclosure**:

1. You report the vulnerability privately
2. We confirm and develop a fix
3. We release a security patch
4. After 90 days (or mutual agreement), we publish details

### Security Best Practices

This application:

- ✅ Stores secrets in memory only (never on disk)
- ✅ Uses platform-native secure storage for tokens
  - Windows: Credential Manager + AES-256-GCM
  - macOS: Keychain (device-only, no sync)
  - Linux: Secret Service + AES-256-GCM
- ✅ HTTPS only, optional certificate pinning
- ✅ Auto-lock on inactivity
- ✅ No third-party analytics by default
- ✅ Minimal permissions
- ✅ Code signing (Windows, macOS, Linux)

### Out of Scope

The following are **not** considered vulnerabilities:

- Issues in dependencies (report to upstream)
- Social engineering attacks
- Physical access attacks
- Denial of service (local only)
- Issues requiring physical access to an unlocked device

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | ✅ (active dev)    |

We only support the latest release. Please update before reporting.

### Hall of Fame

We thank the following researchers for responsible disclosure:

- (None yet - be the first!)

---

Thank you for helping keep OTS Desktop Client secure!
