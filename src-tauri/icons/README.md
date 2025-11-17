# Application Icons

This directory should contain the application icons in the following formats:

- `32x32.png` - 32x32 pixel icon
- `128x128.png` - 128x128 pixel icon
- `128x128@2x.png` - 256x256 pixel icon for retina displays
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon file

You can generate these icons from a single source image using tools like:
- [tauri-icon](https://github.com/tauri-apps/tauri-icon)
- Online icon generators

For development, placeholder icons can be created using ImageMagick:

```bash
# Install ImageMagick first, then:
convert -size 32x32 xc:#3b82f6 32x32.png
convert -size 128x128 xc:#3b82f6 128x128.png
convert -size 256x256 xc:#3b82f6 128x128@2x.png
convert -size 256x256 xc:#3b82f6 icon.icns
convert -size 256x256 xc:#3b82f6 icon.ico
```

Or use the tauri-icon CLI:

```bash
npm install -g @tauri-apps/cli
npm run tauri icon path/to/source-icon.png
```
