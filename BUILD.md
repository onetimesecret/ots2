# Build Guide - Onetimesecret Desktop

This guide provides step-by-step instructions for building the Onetimesecret Desktop application on Windows, macOS, and Linux.

## Prerequisites

### Common Requirements (All Platforms)
- **Node.js** 18.0 or higher ([download](https://nodejs.org/))
- **npm** 9.0 or higher (included with Node.js)
- **Rust** 1.70 or higher ([install](https://rustup.rs/))
- **Git** (for cloning the repository)

### Platform-Specific Requirements

#### Windows
- **Microsoft Visual Studio C++ Build Tools**
  - Install from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
  - Select "Desktop development with C++" workload
- **WebView2** (Usually pre-installed on Windows 10/11)

#### macOS
- **Xcode Command Line Tools**
  ```bash
  xcode-select --install
  ```
- macOS 10.13 or later

#### Linux
Required packages (Debian/Ubuntu):
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libsecret-1-dev
```

For other distributions, install equivalent packages for:
- webkit2gtk
- GTK 3
- libssl
- libayatana-appindicator or libappindicator
- librsvg2
- libsecret

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd onetimesecret-desktop
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Rust dependencies will be installed automatically during build
```

## Development

### Run in Development Mode
```bash
npm run tauri:dev
```

This will:
1. Start the Vite development server on port 1420
2. Launch the Tauri application with hot-reload enabled
3. Open DevTools automatically in debug mode

### Development Features
- **Hot Reload**: Frontend changes are reflected immediately
- **DevTools**: Automatically opened in debug builds
- **Logging**: Console logs visible in terminal and DevTools

## Building

### Create Production Build
```bash
npm run tauri:build
```

### Build Output Locations

#### Windows
- **Installer**: `src-tauri/target/release/bundle/nsis/Onetimesecret Desktop_0.1.0_x64-setup.exe`
- **MSI**: `src-tauri/target/release/bundle/msi/Onetimesecret Desktop_0.1.0_x64_en-US.msi`
- **Executable**: `src-tauri/target/release/onetimesecret-desktop.exe`

#### macOS
- **DMG**: `src-tauri/target/release/bundle/dmg/Onetimesecret Desktop_0.1.0_x64.dmg`
- **App Bundle**: `src-tauri/target/release/bundle/macos/Onetimesecret Desktop.app`

#### Linux
- **AppImage**: `src-tauri/target/release/bundle/appimage/onetimesecret-desktop_0.1.0_amd64.AppImage`
- **Debian**: `src-tauri/target/release/bundle/deb/onetimesecret-desktop_0.1.0_amd64.deb`
- **Executable**: `src-tauri/target/release/onetimesecret-desktop`

## Testing

### Frontend Tests
```bash
# Run Vitest unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### Rust Tests
```bash
cd src-tauri
cargo test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Security Checklist

Before distribution, ensure:

- [ ] **CSP is configured** - Check `src-tauri/tauri.conf.json` for Content Security Policy
- [ ] **Capabilities are minimal** - Review `src-tauri/capabilities/default.json`
- [ ] **Input validation** - All IPC commands validate inputs in Rust handlers
- [ ] **Secure storage** - API credentials use platform keychain (keyring crate)
- [ ] **HTTPS only** - API client enforces HTTPS connections
- [ ] **Release build tested** - Test with `--release` flag before distribution
- [ ] **No debug symbols** - Release builds don't include debug information
- [ ] **Dependencies audited** - Run `npm audit` and `cargo audit`

## Troubleshooting

### Common Issues

#### Build Fails on Linux
**Issue**: Missing dependencies
**Solution**: Ensure all platform-specific packages are installed (see Prerequisites)

#### Windows Build Fails
**Issue**: Missing Visual Studio Build Tools
**Solution**: Install Microsoft Visual Studio C++ Build Tools with "Desktop development with C++" workload

#### macOS Signing Issues
**Issue**: App not signed or notarized
**Solution**: For distribution, you'll need an Apple Developer account. For local testing, users can right-click the app and select "Open"

#### Port Already in Use
**Issue**: Development server fails to start on port 1420
**Solution**:
```bash
# Kill process using port 1420
# On macOS/Linux:
lsof -ti:1420 | xargs kill -9
# On Windows:
netstat -ano | findstr :1420
taskkill /PID <PID> /F
```

#### Keyring/Secure Storage Errors
**Issue**: Failed to access platform keychain
**Solution**:
- **Linux**: Ensure `gnome-keyring` or `kwallet` is running
- **macOS**: Grant Keychain access when prompted
- **Windows**: Ensure Windows Credential Manager is accessible

## Performance Tips

### Faster Builds
```bash
# Use release mode with optimizations
npm run tauri:build -- --release

# Parallel compilation (set in .cargo/config.toml)
# Already configured in the project
```

### Smaller Bundle Size
- Remove unused dependencies from `package.json`
- Enable LTO (Link Time Optimization) in `Cargo.toml` (already enabled)
- Use `strip` to remove debug symbols from release builds

## Platform-Specific Notes

### Windows
- First build will take longer due to downloading Windows SDK components
- Antivirus may slow down the build process
- Builds create both NSIS installer and MSI package

### macOS
- Code signing requires Apple Developer account for distribution
- For universal binaries (ARM + Intel), use `--target universal-apple-darwin`
- DMG creation requires `create-dmg` tool (installed automatically)

### Linux
- AppImage is the most portable format
- DEB package works on Debian/Ubuntu and derivatives
- For RPM-based distros, consider adding RPM bundle target

## Next Steps

After building:
1. Test the application thoroughly on target platforms
2. Set up code signing for production releases
3. Configure CI/CD for automated builds
4. Prepare distribution channels (website, app stores, etc.)

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/onetimesecret/ots2/issues)
- Review [Tauri Documentation](https://v2.tauri.app/)
- Consult [Onetimesecret API Docs](https://docs.onetimesecret.dev/)
