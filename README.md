# OneTimeSecret Desktop

A security-first desktop application for [OneTimeSecret](https://onetimesecret.com), built with Tauri 2.0, Vue 3, and TypeScript.

## Features

- **Secure API Integration:** Full integration with OneTimeSecret v2 REST API
- **Platform-Native Security:** Credentials stored in system keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- **Cross-Platform:** Works on Windows, macOS, and Linux
- **Modern UI:** Clean, responsive interface built with Vue 3 and TypeScript
- **Type-Safe:** Full TypeScript coverage for both frontend and Rust backend
- **Privacy-First:** Zero plaintext storage, strict CSP, minimal permissions

## Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Platform-specific dependencies (see [BUILD.md](BUILD.md))

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Run tests
npm test
cd src-tauri && cargo test
```

### Building

```bash
# Production build
npm run tauri:build
```

See [BUILD.md](BUILD.md) for comprehensive build instructions.

## Architecture

### Frontend (Vue 3 + TypeScript)
- **Components:** Modular Vue components with Composition API
- **State Management:** Pinia for reactive state
- **Type Safety:** Full TypeScript definitions
- **Styling:** CSS custom properties, no external UI frameworks

### Backend (Rust)
- **API Client:** Async HTTP client for OneTimeSecret API
- **Secure Storage:** Platform-specific credential storage
- **IPC Commands:** Type-safe Tauri commands
- **Error Handling:** Comprehensive error types and handling

### Security Features

1. **Content Security Policy (CSP):** Strict CSP headers prevent XSS and injection attacks
2. **Capabilities System:** Minimal permissions following principle of least privilege
3. **Secure Storage:** Never stores credentials in plaintext or localStorage
4. **HTTPS Only:** All API communication enforced over HTTPS
5. **Input Validation:** Client and server-side validation
6. **No Telemetry:** Zero tracking or analytics

## Project Structure

```
ots2/
├── src/                         # Vue 3 frontend
│   ├── components/              # Vue components
│   │   ├── CreateSecret.vue    # Create secret form
│   │   ├── RetrieveSecret.vue  # Retrieve secret form
│   │   ├── SecretList.vue      # List of created secrets
│   │   ├── SetupView.vue       # Initial setup/login
│   │   └── MainView.vue        # Main application layout
│   ├── stores/                  # Pinia stores
│   │   └── app.ts              # Application state
│   ├── services/                # Service layer
│   │   └── tauri.ts            # Tauri IPC wrappers
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts
│   └── main.ts                  # Application entry point
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── api.rs              # OneTimeSecret API client
│   │   ├── storage.rs          # Secure credential storage
│   │   ├── commands.rs         # Tauri command handlers
│   │   ├── error.rs            # Error types and handling
│   │   ├── lib.rs              # Library entry point
│   │   └── main.rs             # Application entry point
│   ├── capabilities/            # Tauri permissions
│   │   └── main-capability.json
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri configuration
├── BUILD.md                     # Comprehensive build guide
└── package.json                 # Node.js dependencies
```

## API Coverage

The application implements the following OneTimeSecret v2 API endpoints:

- ✅ `POST /api/v2/share` - Create a secret
- ✅ `POST /api/v2/secret/:key` - Retrieve a secret
- ✅ `GET /api/v2/private/:key` - Get secret metadata
- ✅ `POST /api/v2/private/:key` - Delete/burn a secret
- ✅ `GET /api/v2/status` - Test API connection

## Development Principles

### Security First
- Never store sensitive data in plaintext
- Minimal attack surface through strict permissions
- Regular dependency audits
- Secure by default configuration

### Clean Architecture
- Clear separation of concerns (UI, business logic, API)
- Type-safe interfaces throughout
- Testable, modular code
- Principle of least astonishment

### Open Source Best Practices
- Comprehensive documentation
- Unit and integration tests
- Reproducible builds
- Clear contribution guidelines

## Testing

### Frontend Tests
```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
```

### Backend Tests
```bash
cd src-tauri
cargo test           # Run all Rust tests
cargo test -- --nocapture  # With output
```

## Contributing

Contributions are welcome! Please:

1. Read the security guidelines in [BUILD.md](BUILD.md)
2. Follow the existing code style and architecture
3. Add tests for new features
4. Update documentation as needed
5. Ensure all tests pass before submitting

## Security

### Reporting Vulnerabilities

Please report security vulnerabilities privately to the maintainers. Do not create public issues for security problems.

### Security Features

- Platform-native secure storage (no plaintext credentials)
- Strict Content Security Policy
- Capability-based permissions (Tauri 2.0)
- HTTPS-only API communication
- Input validation on both client and server
- Zero localStorage usage for sensitive data

## License

See [LICENSE](LICENSE) file for details.

## Resources

- [OneTimeSecret API Documentation](https://docs.onetimesecret.dev/)
- [Tauri Documentation](https://v2.tauri.app/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Build Guide](BUILD.md)

## Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Secure desktop application framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Rust](https://www.rust-lang.org/) - Systems programming language
- [OneTimeSecret](https://onetimesecret.com/) - Secret sharing service
