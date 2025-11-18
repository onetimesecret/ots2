# Contributing to OneTimeSecret Desktop

Thank you for your interest in contributing to OneTimeSecret Desktop! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, professional, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of TypeScript, Vue 3, and Electron
- Understanding of security best practices

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/ots2.git
cd ots2

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `security/description` - Security improvements
- `docs/description` - Documentation updates

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `security`: Security improvement
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(api): add support for custom TTL values

Implement custom TTL selection in the CreateSecret component
with validation and user-friendly time format options.

Closes #123
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for objects
- Use explicit return types for functions
- Avoid `any` type (use `unknown` if necessary)

```typescript
// Good
interface User {
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### Vue Components

- Use `<script setup>` syntax
- Prefer composition API
- Use TypeScript for all scripts
- Keep components focused and small

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### File Organization

```
src/
├── main/           # Main process code
│   ├── index.ts    # Entry point
│   ├── api/        # API clients
│   ├── ipc/        # IPC handlers
│   ├── security/   # Security features
│   └── storage/    # Data storage
├── renderer/       # Renderer process
│   ├── components/ # Vue components
│   ├── stores/     # Pinia stores
│   └── main.ts     # Entry point
└── shared/         # Shared code
    ├── types/      # Type definitions
    └── utils/      # Utility functions
```

## Security Guidelines

### Critical Rules

1. **Never log sensitive data**: No passwords, tokens, or secrets in logs
2. **Validate all inputs**: Use Zod schemas for runtime validation
3. **Sanitize outputs**: Prevent XSS when displaying user data
4. **Use secure storage**: Always use electron.safeStorage for credentials
5. **Maintain CSP**: Don't weaken Content Security Policy
6. **Preserve isolation**: Keep context isolation and sandbox enabled

### Security Checklist

Before submitting:

- [ ] All user inputs are validated
- [ ] No sensitive data in logs or error messages
- [ ] API responses are validated with Zod
- [ ] No use of `eval()`, `Function()`, or `innerHTML`
- [ ] Dependencies are up-to-date (`npm audit`)
- [ ] No weakening of security settings

## Testing

### Manual Testing

```bash
# Run in development mode
npm run dev

# Test all features:
# 1. Credential storage and retrieval
# 2. Secret creation with various options
# 3. Secret retrieval with passphrase
# 4. Error handling
# 5. Network error scenarios
```

### Type Checking

```bash
npm run type-check
```

## Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following code style guidelines
3. **Test thoroughly** in development mode
4. **Update documentation** if needed
5. **Run type checking**: `npm run type-check`
6. **Commit with clear messages**
7. **Push to your fork**
8. **Create a Pull Request**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Security improvement
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested in development mode
- [ ] Type checking passed
- [ ] No new warnings or errors

## Security Impact
- [ ] No security implications
- [ ] Security review required (explain why)

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Documentation

### Code Comments

- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up-to-date

```typescript
/**
 * Encrypt and store a secret value using OS-level encryption
 * @param key - Storage key identifier
 * @param value - Secret value to encrypt
 * @throws {Error} If encryption is not available
 */
async function setSecureItem(key: string, value: string): Promise<void> {
  // implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing installation steps
- Modifying configuration options
- Adding dependencies

## Common Tasks

### Adding a New Component

```bash
# Create component file
touch src/renderer/components/NewComponent.vue
```

```vue
<script setup lang="ts">
// Component logic
</script>

<template>
  <!-- Component template -->
</template>

<style scoped>
/* Component styles */
</style>
```

### Adding a New IPC Channel

1. Add channel to `src/shared/types/app.ts`:
```typescript
export enum IpcChannel {
  NEW_FEATURE = 'feature:action',
}
```

2. Add handler in `src/main/ipc/index.ts`:
```typescript
ipcMain.handle(IpcChannel.NEW_FEATURE, async (_event, arg) => {
  // implementation
})
```

3. Add to preload API in `src/main/preload.ts`:
```typescript
newFeature: (arg: string) => ipcRenderer.invoke(IpcChannel.NEW_FEATURE, arg)
```

### Adding Dependencies

```bash
# Add production dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Audit for security
npm audit
```

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v0.1.0`
4. Build for all platforms: `npm run build`
5. Create GitHub release with binaries

## Getting Help

- Check existing issues
- Review documentation
- Ask questions in discussions
- Follow security reporting process for vulnerabilities

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OneTimeSecret Desktop!
