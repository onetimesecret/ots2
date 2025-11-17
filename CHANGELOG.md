# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Configurable API endpoints**: Settings now properly control which API server is used
- **API authentication support**: Added username/password authentication for custom OTS instances
- **HTTP client connection pooling**: Reuses HTTP client across requests for better performance
- **Request timeouts**: 30-second timeout for requests, 10-second connect timeout
- **Proper settings persistence**: Settings now saved to platform-native secure storage
- **Improved error handling**: User-friendly error messages with detailed logging
- **Startup settings loading**: Settings automatically loaded from secure storage on app start

### Changed
- **Error messages sanitized**: Production builds show user-friendly messages, details logged for debugging
- **Settings structure updated**: Uses snake_case to match Rust conventions (`api_endpoint`, `default_ttl`)
- **HTTP status code handling**: Specific error messages for 401, 403, 404, 429, 5xx errors
- **Settings UI enhanced**: Added API authentication fields with secure password input

### Fixed
- **Hardcoded API endpoints**: Now uses configured endpoint from settings
- **Settings not persisting**: Now properly saved to and loaded from secure storage
- **HTTP client performance**: Single client instance reused instead of creating per request
- **Error information leakage**: Sensitive error details no longer exposed to frontend

### Security
- **API credentials storage**: Credentials stored in platform-native secure storage
- **Logging added**: Error details logged server-side, only safe messages sent to UI
- **Request timeouts**: Prevents hanging connections
- **User agent header**: Identifies app version for API analytics

## [0.1.0] - 2025-11-17

### Added
- Initial release with Tauri v2, Vue 3, and TypeScript
- Create and retrieve one-time secrets
- Platform-native secure storage integration
- Strict Content Security Policy
- Type-safe IPC between frontend and backend
- Settings management UI
- Cross-platform support (Windows, macOS, Linux)

[Unreleased]: https://github.com/onetimesecret/ots2/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/onetimesecret/ots2/releases/tag/v0.1.0
