# Onetimesecret Desktop

A secure, privacy-first desktop application for [Onetimesecret](https://onetimesecret.com) built with Tauri v2, Rust, and Vue 3.

## Overview

Onetimesecret Desktop provides a native, cross-platform interface for securely sharing sensitive information using the Onetimesecret service. Built with security as the top priority, it leverages Tauri's security model, Rust's memory safety, and platform-specific credential storage.

### Key Features

- **🔒 Security First**: Implements Tauri's capability system, CSP, and secure IPC communication
- **🔐 Secure Credential Storage**: Uses platform-specific keychains (macOS Keychain, Windows Credential Manager, Linux Secret Service)
- **🌐 Cross-Platform**: Works on Windows, macOS, and Linux
- **⚡ Modern Stack**: Built with Tauri v2, Rust, and Vue 3 + TypeScript
- **🎯 Clean Architecture**: Repository pattern, modular Rust backend, feature-based frontend
- **✅ Type-Safe**: Full TypeScript coverage and Rust's type system
- **🧪 Tested**: Comprehensive tests for both frontend and backend

## Architecture

### Frontend (Vue 3 + TypeScript)
- **Framework**: Vue 3 with Composition API
- **State Management**: Pinia stores
- **Architecture**: Feature-based modules with repository pattern
- **Type Safety**: Full TypeScript coverage
- **Build Tool**: Vite

### Backend (Rust)
- **Framework**: Tauri v2
- **HTTP Client**: reqwest with rustls for secure HTTPS
- **Secure Storage**: keyring crate with platform-native backends
- **Architecture**: Modular design with clear separation of concerns
  - `api/` - Onetimesecret API client
  - `storage/` - Secure credential storage
  - `commands/` - IPC command handlers
  - `error/` - Error types and handling

### Security Features

1. **Content Security Policy (CSP)**: Restrictive CSP prevents XSS attacks
2. **Capability-Based Permissions**: Granular control over what the app can access
3. **Input Validation**: All IPC commands validate inputs on the Rust side
4. **Secure Storage**: API credentials never stored in plain text
5. **HTTPS Only**: API client enforces HTTPS connections
6. **Memory Safety**: Rust prevents memory-related vulnerabilities
7. **Trust Boundaries**: Strict validation between frontend and backend

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+
- Platform-specific tools (see [BUILD.md](BUILD.md))

### Installation

```bash
# Clone the repository
git clone https://github.com/onetimesecret/ots2.git
cd ots2

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev
```

For detailed build instructions, see [BUILD.md](BUILD.md).

## Usage

### 1. Configure API Credentials

On first launch, configure your Onetimesecret API credentials:
- **API Base URL**: Usually `https://onetimesecret.com`
- **Username**: Your email address
- **API Key**: Your Onetimesecret API key

Credentials are securely stored in your platform's keychain.

### 2. Create a Secret

1. Enter your secret message in the "Create Secret" section
2. Optionally add a passphrase for extra security
3. Choose a time-to-live (TTL) for the secret
4. Click "Create Secret"
5. Copy the generated link and share it securely

### 3. Retrieve a Secret

1. Enter the secret key in the "Retrieve Secret" section
2. If required, enter the passphrase
3. Click "Retrieve Secret"
4. The secret is displayed once and then burned (permanently deleted)

## Development

### Project Structure

```
onetimesecret-desktop/
├── src/                      # Vue frontend source
│   ├── components/           # Vue components
│   ├── stores/              # Pinia stores
│   ├── repositories/        # API repositories
│   ├── App.vue              # Root component
│   └── main.ts              # Entry point
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── api/            # API client modules
│   │   ├── commands.rs     # IPC command handlers
│   │   ├── storage.rs      # Secure storage
│   │   ├── error.rs        # Error types
│   │   └── lib.rs          # Main library
│   ├── capabilities/        # Tauri capabilities
│   └── tauri.conf.json     # Tauri configuration
├── BUILD.md                 # Build instructions
└── package.json            # Node.js dependencies
```

### Available Scripts

```bash
# Development
npm run dev              # Run Vite dev server only
npm run tauri:dev        # Run full Tauri app in dev mode

# Building
npm run build            # Build frontend only
npm run tauri:build      # Build complete application

# Testing
npm run test             # Run frontend tests
npm run type-check       # TypeScript type checking
npm run lint             # Lint code

# Rust tests
cd src-tauri && cargo test
```

### API Integration

The application integrates with Onetimesecret API v2:
- **Endpoint**: `https://onetimesecret.com/api/v2`
- **Authentication**: HTTP Basic Auth (username:api_key)
- **Documentation**: https://docs.onetimesecret.dev/

Implemented endpoints:
- `POST /api/v2/share` - Create a secret
- `POST /api/v2/secret/:key` - Retrieve a secret
- `POST /api/v2/private/:key` - Get secret metadata
- `GET /api/v2/status` - Test connection

## Security Considerations

### Trust Boundaries

The application maintains strict trust boundaries:
- **Frontend → Backend**: All data validated in Rust command handlers
- **Backend → API**: All requests over HTTPS with authentication
- **Storage**: Credentials stored in platform keychain, never in memory longer than necessary

### Threat Model

Protected against:
- ✅ XSS attacks (via CSP and Vue's template escaping)
- ✅ Code injection (Rust's type system and input validation)
- ✅ Credential theft (platform keychain storage)
- ✅ Memory vulnerabilities (Rust's memory safety)
- ✅ MITM attacks (HTTPS-only, certificate validation)

### Security Audit Checklist

Before deployment:
- [ ] Review CSP configuration
- [ ] Audit capability permissions
- [ ] Validate all IPC command inputs
- [ ] Test credential storage on all platforms
- [ ] Run `cargo audit` for Rust dependencies
- [ ] Run `npm audit` for Node dependencies
- [ ] Test with malformed inputs
- [ ] Verify HTTPS enforcement

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

### Code Standards

- **Rust**: Follow Rust API guidelines, use `clippy` for linting
- **TypeScript**: Use ESLint configuration, prefer Composition API
- **Commits**: Use conventional commit messages
- **Security**: Never commit credentials or secrets

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Onetime Secret

## Acknowledgments

- Built with [Tauri](https://tauri.app/) - Secure, lightweight desktop framework
- Uses [Onetimesecret](https://onetimesecret.com) - Simple secret sharing service
- Inspired by [ProtonMail](https://protonmail.com)'s security-first approach

## Support

- **Issues**: https://github.com/onetimesecret/ots2/issues
- **Tauri Docs**: https://v2.tauri.app/
- **OTS API Docs**: https://docs.onetimesecret.dev/

## Roadmap

Future enhancements:
- [ ] Offline secret storage with local encryption
- [ ] Multiple account support
- [ ] Secret history and management
- [ ] Custom secret expiration rules
- [ ] Bulk operations
- [ ] Browser extension integration
- [ ] Mobile apps (iOS/Android via Tauri Mobile)

---

**Built with ❤️ and 🔒 by the Onetimesecret team**