# Changelog

All notable changes to the OneTimeSecret Desktop application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Tauri 2.0 desktop application implementation
- Vue 3 frontend with TypeScript and Composition API
- Rust backend with OneTimeSecret v2 API integration
- Platform-native secure credential storage (Windows Credential Manager, macOS Keychain, Linux libsecret)
- Comprehensive security implementation (CSP, capabilities, HTTPS-only)
- Create secret functionality with passphrase and TTL options
- Retrieve secret functionality with passphrase support
- Secret list management and metadata viewing
- Delete/burn secret functionality
- API connection testing
- Unit tests for Rust backend modules
- Unit tests for Vue frontend stores and services
- Comprehensive build documentation (BUILD.md)
- Contributing guidelines with security checklist (CONTRIBUTING.md)
- GitHub Actions workflows for security audits and testing
- Constants module for configuration values
- Enhanced error handling with specific error types
- PR review documentation

### Security
- Strict Content Security Policy configuration
- Capability-based permission system
- No plaintext credential storage
- HTTPS-only API communication
- Input validation on client and server
- No localStorage usage for sensitive data
- Automated security audits via GitHub Actions

### Changed
- Improved error messages with user-friendly guidance
- Refactored TTL values to use constants
- Enhanced API error handling with rate limiting and timeout support

### Developer Experience
- VSCode recommended extensions and settings
- Automated security and dependency audits
- Test infrastructure for both frontend and backend
- Clear separation of concerns in architecture

## [0.1.0] - 2025-11-17

### Initial Release
- First working version of OneTimeSecret Desktop
- Cross-platform support (Windows, macOS, Linux)
- Full OneTimeSecret API v2 integration
- Security-first implementation
- Comprehensive documentation

---

## Release Notes Format

### Added
New features and functionality

### Changed
Changes to existing functionality

### Deprecated
Features that will be removed in upcoming releases

### Removed
Features that have been removed

### Fixed
Bug fixes

### Security
Security-related changes and improvements

---

## Contributing

When adding changelog entries:
1. Add entries under [Unreleased]
2. Use the appropriate category (Added, Changed, Fixed, etc.)
3. Include clear, concise descriptions
4. Link to relevant issues or PRs when applicable
5. Move entries to a new version section when releasing

Example:
```markdown
### Added
- Feature description (#123)

### Fixed
- Bug fix description (#124)
```
