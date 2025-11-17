# OTS Desktop Client

A privacy-first desktop client for [One-Time Secret](https://onetimesecret.com)'s v2 REST API, built with Tauri + Vue 3 + TypeScript.

## Features

- **Privacy-First**: All secrets stored in memory, never on disk
- **Secure Storage**: API tokens encrypted using platform-native secure storage
  - Windows: Credential Manager + AES-256-GCM
  - macOS: Keychain (device-only, no iCloud sync)
  - Linux: Secret Service + AES-256-GCM
- **Auto-Lock**: Configurable timeout with biometric support (planned)
- **Type-Safe**: Full TypeScript with Zod validation
- **Testable**: Comprehensive test suite with MSW mocks
- **Cross-Platform**: Windows 10+, macOS 11+, Ubuntu 20.04+

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Rust 1.80+

### Installation

```bash
# Clone repository
git clone https://github.com/onetimesecret/ots2.git
cd ots2

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Run in development
pnpm tauri:dev
```

### Build

```bash
# Lint and typecheck
pnpm lint
pnpm typecheck

# Run tests
pnpm test:unit

# Build for production
pnpm tauri:build
```

Outputs in `src-tauri/target/release/bundle/`:
- `*.msi` (Windows)
- `*.dmg` (macOS)
- `*.AppImage` (Linux)

## Architecture

```
src/
├── core/           # Environment, errors, router
├── security/       # Stronghold, crypto, app lock
├── network/        # API client, retry policy, DTOs
├── features/       # Secret & settings features
│   ├── secret/     # Secret management
│   └── settings/   # App settings
└── assets/         # i18n, static assets
```

State: Pinia
DI: tsyringe
Testing: Vitest + MSW

## Security

- HTTPS only with optional certificate pinning
- No third-party analytics (opt-in Sentry via flag)
- Minimal permissions
- Code signed (see build documentation)

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

[MIT](./LICENSE)

## Support

- Issues: [GitHub Issues](https://github.com/onetimesecret/ots2/issues)
- Discussions: [GitHub Discussions](https://github.com/onetimesecret/ots2/discussions)