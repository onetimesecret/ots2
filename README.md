# OneTimeSecret Desktop

A secure, privacy-first desktop client for [One-Time Secret](https://onetimesecret.dev/) built with Electron, Vue 3, and TypeScript.

## 🔒 Security Features

This application prioritizes security and privacy:

- **OS-Level Encryption**: Credentials stored using `electron.safeStorage`
  - Windows: DPAPI (Data Protection API)
  - macOS: Keychain Services
  - Linux: Secret Service API (libsecret)

- **Context Isolation**: Renderer process is fully sandboxed and isolated
- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **Certificate Pinning**: Prevents MITM attacks on API connections
- **No Remote Code**: All code runs locally, no remote module loading
- **Secure IPC**: Type-safe communication between processes via contextBridge
- **Network Security**: HTTPS-only connections with validation
- **Memory Safety**: Secrets are cleared from memory after use

## 📋 Prerequisites

- Node.js 18+ and npm
- macOS, Windows, or Linux
- One-Time Secret account (get one at [onetimesecret.dev](https://onetimesecret.dev))

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### First Run

1. Launch the application
2. Enter your One-Time Secret API credentials:
   - Username: Your OTS username
   - API Token: Your OTS API token (Settings → API)
   - API Base URL: Default is `https://onetimesecret.dev/api/v2`
3. Credentials are securely encrypted and stored using OS-level encryption

## 📦 Building for Distribution

### All Platforms

```bash
# Build application
npm run build

# Output will be in the 'release' directory
```

### Platform-Specific Builds

The `electron-builder` configuration in `package.json` supports:

- **macOS**: DMG installer with code signing support
- **Windows**: NSIS installer
- **Linux**: AppImage and .deb packages

## 🏗️ Architecture

### Project Structure

```
ots2/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── preload.ts     # Secure IPC bridge
│   │   ├── api/           # OTS API client
│   │   ├── security/      # Security features (CSP, cert pinning)
│   │   ├── storage/       # Secure storage (safeStorage)
│   │   └── ipc/           # IPC handlers
│   ├── renderer/          # Vue application
│   │   ├── App.vue        # Main component
│   │   ├── components/    # UI components
│   │   ├── stores/        # Pinia state management
│   │   └── main.ts        # Renderer entry point
│   └── shared/            # Shared code
│       ├── types/         # TypeScript interfaces
│       └── utils/         # Utility functions
├── build/                 # Build configuration
└── public/                # Static assets
```

### Security Architecture

```
┌─────────────────────────────────────┐
│         Renderer Process            │
│  (Sandboxed, Context Isolated)      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Vue Components             │  │
│  │   (UI Layer)                 │  │
│  └──────────────────────────────┘  │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │   Pinia Stores               │  │
│  │   (State Management)         │  │
│  └──────────────────────────────┘  │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │   Electron API (Preload)     │  │
│  │   (Secure IPC Bridge)        │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
               ▼ IPC
┌─────────────────────────────────────┐
│          Main Process               │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   IPC Handlers               │  │
│  │   (Request Validation)       │  │
│  └──────────────────────────────┘  │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │   API Client                 │  │
│  │   (Zod Validation, Retry)    │  │
│  └──────────────────────────────┘  │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │   Secure Storage             │  │
│  │   (OS-Level Encryption)      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
               ▼ HTTPS + Cert Pinning
┌─────────────────────────────────────┐
│     OTS API (onetimesecret.dev)     │
└─────────────────────────────────────┘
```

## 🔐 Security Best Practices

### For Users

1. **Verify Downloads**: Only download from official sources
2. **Keep Updated**: Install updates promptly for security patches
3. **Protect API Tokens**: Never share your API credentials
4. **Use Strong Passphrases**: Add extra protection to sensitive secrets
5. **Verify Recipients**: Double-check recipient emails before sharing

### For Developers

1. **Dependency Auditing**: Run `npm audit` regularly
2. **Code Review**: Review all code changes for security implications
3. **Type Safety**: Leverage TypeScript's strict mode
4. **Input Validation**: Validate all user inputs with Zod schemas
5. **Error Handling**: Never expose sensitive data in error messages

## 🧪 Development

### Development Mode

```bash
# Start with hot reload
npm run dev

# Type checking
npm run type-check
```

### Security Considerations During Development

- DevTools are enabled in development mode only
- Certificate pinning is active in all modes
- Secure storage works in development (uses OS encryption)
- CSP is enforced in all modes

## 🔧 Configuration

### API Configuration

The application connects to One-Time Secret API v2:

- **Default URL**: `https://onetimesecret.dev/api/v2`
- **Authentication**: HTTP Basic Auth (username + API token)
- **Retry Logic**: 3 attempts with exponential backoff
- **Timeout**: 30 seconds per request

### Security Configuration

Certificate pinning is implemented but requires manual pin updates. To update certificate pins:

1. Fetch current certificate fingerprint:
   ```bash
   openssl s_client -connect onetimesecret.dev:443 -servername onetimesecret.dev < /dev/null 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
   ```

2. Update `src/main/security/certificate-pinning.ts` with new fingerprint

## 🐛 Troubleshooting

### Credentials Not Saving

- Ensure your OS keychain/credential manager is accessible
- On Linux, ensure `libsecret` is installed
- Check application logs for encryption errors

### API Connection Issues

- Verify your API credentials are correct
- Check network connectivity
- Ensure firewall allows HTTPS to onetimesecret.dev
- Review certificate pinning logs if connection fails

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is 18+
- Check for platform-specific build requirements (Xcode on macOS, VS Build Tools on Windows)

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [One-Time Secret](https://onetimesecret.dev/) for the excellent secret sharing service
- [Electron](https://www.electronjs.org/) for the cross-platform framework
- [Vue.js](https://vuejs.org/) for the reactive UI framework
- Security practices inspired by [Signal Desktop](https://github.com/signalapp/Signal-Desktop) and [ProtonMail Desktop](https://github.com/ProtonMail/proton-mail-desktop)

## 🔗 Resources

- [One-Time Secret API Documentation](https://onetimesecret.dev/docs/api)
- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🚨 Security Reporting

If you discover a security vulnerability, please create an issue in this repository.

---

**Note**: This is an unofficial client for One-Time Secret. Always verify the integrity of shared secrets through trusted channels.