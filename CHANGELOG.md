# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Electron, Vue 3, and TypeScript
- Secure credential storage using electron.safeStorage (OS-level encryption)
- One-Time Secret API v2 integration with Zod validation
- Context isolation and sandboxed renderer process
- Content Security Policy (CSP) implementation
- Certificate pinning for API connections
- Secure IPC bridge with type-safe communication
- Create secret functionality with TTL and passphrase options
- Retrieve secret functionality with passphrase support
- Pinia state management for application state
- Retry logic with exponential backoff for API requests
- Comprehensive security documentation
- Cross-platform build support (macOS, Windows, Linux)

### Security
- Enabled context isolation and sandbox mode
- Implemented strict CSP headers
- Added certificate pinning for onetimesecret.dev
- Encrypted credential storage using OS keychains
- Disabled Node integration in renderer
- Prevented navigation to external URLs
- Blocked insecure HTTP connections

## [0.1.0] - 2024-11-17

### Added
- Initial release
- Basic secret creation and retrieval
- Secure credential management
- Cross-platform support

[Unreleased]: https://github.com/yourusername/ots2/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/ots2/releases/tag/v0.1.0
