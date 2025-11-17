# OneTimeSecret Desktop - Build Guide

A security-first desktop application for OneTimeSecret built with Tauri 2.0, Vue 3, and TypeScript.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Security Configuration](#security-configuration)
4. [Building the Application](#building-the-application)
5. [Platform-Specific Instructions](#platform-specific-instructions)
6. [Code Signing](#code-signing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### All Platforms

- **Node.js** 18+ and npm 9+
- **Rust** 1.70+ and Cargo

### Platform-Specific

#### Windows
- [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- WebView2 (usually pre-installed on Windows 10/11)

#### macOS
- Xcode Command Line Tools: `xcode-select --install`
- macOS 10.15+ (Catalina or later)

#### Linux
- **Debian/Ubuntu:**
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libsecret-1-dev
  ```

- **Arch Linux:**
  ```bash
  sudo pacman -Syu
  sudo pacman -S webkit2gtk-4.1 base-devel curl wget file openssl gtk3 libappindicator-gtk3 librsvg libsecret
  ```

- **Fedora:**
  ```bash
  sudo dnf install webkit2gtk4.1-devel \
    openssl-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel \
    libsecret-devel
  sudo dnf group install "C Development Tools and Libraries"
  ```

## Development Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd ots2

# Install Node.js dependencies
npm install

# The Rust dependencies will be installed automatically by Cargo
```

### 2. Development Mode

Run the application in development mode with hot-reload:

```bash
npm run tauri:dev
```

This will:
- Start the Vite development server on port 1420
- Compile the Rust backend
- Launch the Tauri application window
- Enable hot-reload for both frontend and backend changes

### 3. Run Tests

**Frontend tests:**
```bash
npm test
```

**Backend tests:**
```bash
cd src-tauri
cargo test
```

## Security Configuration

### Content Security Policy (CSP)

The application uses a strict CSP defined in `src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "security": {
      "csp": {
        "default-src": "'self'",
        "connect-src": "'self' https://onetimesecret.com https://*.onetimesecret.com"
      }
    }
  }
}
```

**Important:** If using a custom OneTimeSecret instance, update the `connect-src` directive.

### Capabilities and Permissions

Capabilities are defined in `src-tauri/capabilities/main-capability.json` following the principle of least privilege:

- Window management permissions (close, minimize, maximize)
- Secure storage access (limited to specific keys)
- Shell open permission (for external links)

**Never add unnecessary permissions.** Review and audit any permission additions.

### Secure Storage

The application uses platform-specific secure storage:

- **Windows:** Credential Manager
- **macOS:** Keychain Services
- **Linux:** Secret Service API (libsecret)

API credentials are NEVER stored in:
- localStorage
- Plain text files
- Application memory longer than necessary

## Building the Application

### Development Build

```bash
npm run tauri:build
```

This creates a debug build in `src-tauri/target/debug/`.

### Production Build

```bash
npm run tauri:build -- --release
```

Production builds are created in `src-tauri/target/release/` and include:
- Optimized Rust code
- Minified frontend assets
- Platform-specific installers in `src-tauri/target/release/bundle/`

### Build Outputs

Depending on your platform, you'll find:

- **Windows:** `.exe`, `.msi` installer
- **macOS:** `.app` bundle, `.dmg` installer
- **Linux:** `.deb`, `.rpm`, `.AppImage`

## Platform-Specific Instructions

### Windows

**Building:**
```bash
npm run tauri:build
```

**Output:** `src-tauri\target\release\bundle\msi\`

**Notes:**
- Requires Windows 10+ for WebView2
- MSI installer requires WiX Toolset (auto-downloaded by Tauri)

### macOS

**Building:**
```bash
npm run tauri:build
```

**Output:** `src-tauri/target/release/bundle/macos/`

**Notes:**
- Creates universal binary (Intel + Apple Silicon) by default
- For Apple Silicon only: `npm run tauri:build -- --target aarch64-apple-darwin`
- For Intel only: `npm run tauri:build -- --target x86_64-apple-darwin`

### Linux

**Building:**
```bash
npm run tauri:build
```

**Output:** `src-tauri/target/release/bundle/`

**Notes:**
- AppImage is the most portable format
- DEB/RPM for specific distributions
- Ensure all runtime dependencies are listed in the bundle configuration

## Code Signing

### macOS

1. **Obtain Apple Developer Certificate**
2. **Configure in `tauri.conf.json`:**
   ```json
   {
     "bundle": {
       "macOS": {
         "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
       }
     }
   }
   ```
3. **Build with signing:**
   ```bash
   npm run tauri:build
   ```

### Windows

1. **Obtain Code Signing Certificate** (EV or OV)
2. **Use signtool.exe:**
   ```bash
   signtool sign /f cert.pfx /p password /t http://timestamp.digicert.com installer.exe
   ```

### Linux

AppImage and other formats can be signed with GPG:
```bash
gpg --detach-sign --armor app.AppImage
```

## Environment Variables

Create a `.env` file in the root directory for development:

```env
# Optional: Custom API endpoint for development
VITE_DEFAULT_ENDPOINT=https://onetimesecret.com
```

**Never commit `.env` files with secrets!**

## Build Reproducibility

To ensure reproducible builds across environments:

1. Use the exact Node.js and Rust versions specified
2. Lock dependencies: `npm ci` instead of `npm install`
3. Use Cargo.lock: `cargo build --locked`
4. Set `RUSTFLAGS` for deterministic builds:
   ```bash
   export RUSTFLAGS="-C debuginfo=0 -C opt-level=3"
   ```

## Troubleshooting

### Build Fails on Linux

**Error:** `webkit2gtk not found`
**Solution:** Install webkit2gtk-4.1-dev (see Prerequisites)

### Windows: WebView2 Error

**Error:** `WebView2 runtime not found`
**Solution:** Install [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)

### macOS: Code Signing Issues

**Error:** `code object is not signed at all`
**Solution:** Configure signing identity or disable signing for development:
```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": null
    }
  }
}
```

### Rust Compilation Errors

**Error:** `failed to compile`
**Solution:**
1. Update Rust: `rustup update`
2. Clean build: `cd src-tauri && cargo clean`
3. Rebuild: `cargo build`

### Port 1420 Already in Use

**Error:** `Port 1420 is already in use`
**Solution:** Change port in `vite.config.ts` and `tauri.conf.json`

## Architecture Overview

```
ots2/
├── src/                      # Vue 3 frontend
│   ├── components/           # Vue components
│   ├── stores/              # Pinia state management
│   ├── services/            # Tauri IPC wrappers
│   └── types/               # TypeScript definitions
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── api.rs          # OneTimeSecret API client
│   │   ├── storage.rs      # Secure storage service
│   │   ├── commands.rs     # Tauri command handlers
│   │   └── error.rs        # Error handling
│   └── capabilities/        # Permission definitions
└── dist/                    # Built frontend (generated)
```

## Security Checklist

Before release:
- [ ] All dependencies updated and audited
- [ ] CSP headers properly configured
- [ ] Capabilities follow least privilege
- [ ] Secure storage implemented correctly
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced for all API calls
- [ ] Code signing certificates in place
- [ ] Build reproducibility verified

## Additional Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [Vue 3 Documentation](https://vuejs.org/)
- [OneTimeSecret API Docs](https://docs.onetimesecret.dev/)
- [Rust Security Guidelines](https://anssi-fr.github.io/rust-guide/)

## Support

For issues and questions:
- GitHub Issues: [onetimesecret/ots2](https://github.com/onetimesecret/ots2/issues)
- OneTimeSecret Docs: https://docs.onetimesecret.dev/
