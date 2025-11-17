# Contributing to OTS Desktop Client

Thank you for your interest in contributing! We welcome contributions of all kinds.

## Code of Conduct

Be respectful and professional. Harassment and discrimination will not be tolerated.

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/onetimesecret/ots2/issues) first
2. Include:
   - OS and version
   - Node.js and Rust versions
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs if applicable

### Suggesting Features

1. Open a [discussion](https://github.com/onetimesecret/ots2/discussions) first
2. Explain the use case and benefits
3. Consider security and privacy implications

### Submitting Pull Requests

1. **Fork and clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ots2.git
   cd ots2
   ```

2. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**:
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed
   - Keep commits focused and atomic

4. **Sign your commits** (DCO):
   ```bash
   git commit -s -m "Add feature X"
   ```

   By signing off, you certify that you have the right to submit the code under the project's MIT license.

5. **Run checks**:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test:unit
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

   Then open a pull request on GitHub.

### PR Guidelines

- **Title**: Clear and descriptive (e.g., "Fix secret expiration bug" not "Bug fix")
- **Description**: Explain what and why, reference issues
- **Tests**: Include unit/integration tests
- **Documentation**: Update README, inline comments as needed
- **No secrets**: Never commit API keys, passwords, or credentials

### Security Issues

**DO NOT** open public issues for security vulnerabilities. See [SECURITY.md](./SECURITY.md).

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- Rust 1.80+

### Initial Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Run dev server
pnpm tauri:dev
```

### Project Structure

```
src/
├── core/           # Core utilities (env, errors, router)
├── security/       # Security layer (storage, crypto, lock)
├── network/        # API client and DTOs
├── features/       # Feature modules (secret, settings)
└── assets/         # Static assets
```

### Coding Standards

- **TypeScript**: Strict mode enabled
- **Vue 3**: Composition API with `<script setup>`
- **Styling**: Scoped styles, dark theme only (for now)
- **Errors**: Use sealed error classes from `@/core/error`
- **DI**: Use `tsyringe` decorators
- **Tests**: Vitest + MSW for API mocking

### Testing

```bash
# Unit tests
pnpm test:unit

# Watch mode
pnpm test:watch

# Coverage
pnpm test:unit -- --coverage
```

### Commit Message Format

```
type: brief description

Longer explanation if needed.

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Questions?

Open a [discussion](https://github.com/onetimesecret/ots2/discussions) or comment on an issue.

---

Thank you for contributing!
