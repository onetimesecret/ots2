# OneTimeSecret Desktop

A secure, cross-platform desktop client for [OneTimeSecret](https://onetimesecret.dev/) built with Tauri v2, Vue 3, and TypeScript.

## Features

- **Secure Secret Sharing**: Create one-time secrets with optional passphrases
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Native Secure Storage**: Uses platform-specific secure storage
  - Windows: Credential Manager
  - macOS: Keychain
  - Linux: Secret Service API (libsecret)
- **Privacy-First**: All API communication happens in the Rust backend
- **Type-Safe**: Full TypeScript support with strict mode enabled
- **Modern UI**: Built with Vue 3 Composition API

## Architecture

This application follows a security-first architecture:

- **Frontend (Vue 3)**: Pure presentation layer with no direct API access
- **Backend (Rust/Tauri)**: Handles all API communication and sensitive operations
- **Type-Safe IPC**: Strongly-typed communication between frontend and backend
- **Secure Storage**: Platform-native credential storage via Tauri plugins

### Project Structure

```
├── src/                    # Vue frontend
│   ├── components/         # Vue components
│   │   ├── CreateSecret.vue
│   │   ├── RetrieveSecret.vue
│   │   └── Settings.vue
│   ├── composables/        # Vue composables
│   │   └── useSecrets.ts
│   ├── stores/             # Pinia stores
│   │   └── secrets.ts
│   ├── types/              # TypeScript types
│   │   └── api.ts
│   ├── utils/              # Utility functions
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   └── style.css           # Global styles
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── main.rs         # Tauri commands
│   ├── capabilities/       # Permission definitions
│   │   └── main-capability.json
│   ├── icons/              # Application icons
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later): [Download](https://nodejs.org/)
- **Rust** (latest stable): [Install via rustup](https://rustup.rs/)
- **Platform-specific dependencies**:
  - **Linux**: `build-essential`, `libwebkit2gtk-4.1-dev`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, `libsecret-1-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Visual Studio C++ Build Tools

### Linux Setup

```bash
sudo apt update
sudo apt install build-essential libwebkit2gtk-4.1-dev libssl-dev libgtk-3-dev \
  libayatana-appindicator3-dev librsvg2-dev libsecret-1-dev
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/onetimesecret/ots2.git
   cd ots2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate application icons** (optional):
   ```bash
   # Create a 1024x1024 PNG icon first, then run:
   npm run tauri icon path/to/icon.png
   ```

## Development

Run the application in development mode with hot-reload:

```bash
npm run tauri:dev
```

This will:
1. Start the Vite dev server on port 1420
2. Launch the Tauri application
3. Enable hot-reload for both frontend and backend changes

## Building

### Build for Current Platform

```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/bundle/`.

### Platform-Specific Builds

**Windows**:
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

**macOS**:
```bash
npm run tauri build -- --target x86_64-apple-darwin
# For Apple Silicon:
npm run tauri build -- --target aarch64-apple-darwin
```

**Linux**:
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## Security

This application implements multiple layers of security:

### Content Security Policy (CSP)

Strict CSP is enforced to prevent XSS attacks:
- `default-src 'self'`: Only allow resources from the app itself
- `connect-src 'self' https://onetimesecret.dev`: Limit API connections
- Scripts and styles are scoped to prevent injection

### Secure Storage

Sensitive data is stored using platform-native secure storage via `tauri-plugin-secure-storage`:
- **Windows**: Windows Credential Manager (encrypted with DPAPI)
- **macOS**: Keychain (encrypted with Keychain Services)
- **Linux**: Secret Service API (encrypted with libsecret)

### API Security

- All API communication happens in the Rust backend
- Certificate pinning can be implemented for additional security
- No sensitive data is stored in browser localStorage
- Type-safe IPC prevents data injection

### Permissions

The application uses Tauri's capability system with minimal permissions:
- Network access only to `https://onetimesecret.dev`
- No filesystem access beyond app data
- No shell execution
- Window operations only

See `src-tauri/capabilities/main-capability.json` for the full permission set.

## Configuration

Application settings can be configured in the Settings tab:

- **API Endpoint**: OneTimeSecret API URL (default: `https://onetimesecret.dev`)
  - Supports custom/self-hosted OneTimeSecret instances
- **Default TTL**: Default time-to-live for secrets (default: 7 days)
- **Theme**: Light, dark, or system theme (UI implementation pending)
- **API Authentication** (Optional):
  - **Username**: API username for authenticated requests
  - **API Key**: API key/password for authenticated requests
  - Required only for custom instances with authentication enabled

All settings are stored securely using platform-native storage and automatically loaded on app startup.

## API Integration

The app integrates with the [OneTimeSecret API v2](https://onetimesecret.dev/docs/api):

### Available Commands

All API operations are implemented as Tauri commands in Rust:

- `create_secret`: Create a new one-time secret
- `retrieve_secret`: Retrieve and destroy a secret
- `get_secret_metadata`: Get secret metadata without destroying it
- `save_settings`: Save app settings to secure storage
- `load_settings`: Load app settings from secure storage

### Example Usage

```typescript
import { invoke } from '@tauri-apps/api/core'

// Create a secret
const result = await invoke<SecretResponse>('create_secret', {
  secret: 'my secret data',
  passphrase: 'optional-password',
  ttl: 604800, // 7 days
})

// Retrieve a secret
const secret = await invoke<SecretValue>('retrieve_secret', {
  secretKey: 'abc123def456',
  passphrase: 'optional-password',
})
```

## Development Best Practices

### Type Safety

- All API DTOs are defined in `src/types/api.ts`
- Rust structs match TypeScript interfaces
- Use the `Result<T, E>` pattern for error handling

### Security

- Never make direct API calls from the frontend
- All sensitive operations must go through Tauri commands
- Use secure storage for any persistent sensitive data
- Follow the principle of least privilege for permissions

### Testing

Before committing changes:
1. Run type checking: `npm run build`
2. Test in dev mode: `npm run tauri:dev`
3. Test production build: `npm run tauri:build`

## Troubleshooting

### Build Errors

**Missing dependencies (Linux)**:
```bash
error: failed to run custom build command for `libsecret-sys`
```
Install libsecret: `sudo apt install libsecret-1-dev`

**Icon errors**:
If you see icon-related errors, generate icons:
```bash
npm run tauri icon path/to/1024x1024.png
```

### Runtime Errors

**Network errors**:
- Check the API endpoint in Settings
- Verify internet connectivity
- Check firewall settings

**Storage errors**:
- On Linux, ensure `libsecret` is installed
- On Windows, check Windows Credential Manager access
- On macOS, check Keychain permissions

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier (configure as needed)
- Write descriptive commit messages
- Document security-critical code

## License

MIT License - see [LICENSE](LICENSE) for details

## Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [Vue 3 Documentation](https://vuejs.org/)
- [OneTimeSecret API](https://onetimesecret.dev/docs/api)
- [Tauri Security Best Practices](https://v2.tauri.app/security/)

## Roadmap

Future enhancements:

- [ ] Batch secret creation
- [ ] Secret templates
- [ ] Encrypted local history
- [ ] QR code generation for secrets
- [ ] Custom API endpoint support
- [ ] Import/export functionality
- [ ] Auto-update support
- [ ] Internationalization (i18n)

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/onetimesecret/ots2/issues)
- Documentation: This README
- API Documentation: [OneTimeSecret Docs](https://onetimesecret.dev/docs)
