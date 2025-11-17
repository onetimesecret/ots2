# Contributing to Onetimesecret Desktop

Thank you for your interest in contributing to Onetimesecret Desktop! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Security issues should be reported privately

## Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ots2.git
   cd ots2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run tauri:dev
   ```

### Project Structure

```
src/                    # Vue 3 + TypeScript frontend
  components/          # UI components
  stores/             # Pinia state stores
  repositories/       # API communication layer
src-tauri/            # Rust backend
  src/
    api/             # OTS API client
    commands.rs      # Tauri IPC commands
    storage.rs       # Secure credential storage
    error.rs         # Error types
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Follow these guidelines:

#### Rust Code
- Use `cargo fmt` to format code
- Run `cargo clippy` for linting
- Add tests for new functionality
- Document public APIs with doc comments
- Follow Rust API Guidelines

#### TypeScript/Vue Code
- Use ESLint configuration
- Prefer Composition API over Options API
- Add TypeScript types for all functions
- Use Pinia for state management
- Follow Vue 3 best practices

#### Security
- Validate all inputs
- Never log sensitive data
- Use secure storage for credentials
- Test with malicious inputs
- Review Tauri security guidelines

### 3. Test Your Changes

```bash
# TypeScript type checking
npm run type-check

# Linting
npm run lint

# Frontend tests
npm run test

# Rust tests
cd src-tauri && cargo test

# Build test
npm run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```
feat: add bulk secret creation
fix: resolve keychain access on Linux
docs: update API integration guide
test: add storage module tests
refactor: simplify error handling
perf: optimize API client
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Test results
- Related issue numbers

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Type checking passes
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] No security vulnerabilities introduced

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Type checking passes
- [ ] No security issues
```

## Security Contributions

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security@onetimesecret.com with details
2. Include steps to reproduce
3. Wait for response before disclosure
4. Allow reasonable time for fix

### Security Best Practices

- Never commit API keys or credentials
- Validate all user inputs
- Use parameterized queries
- Follow OWASP guidelines
- Test with security tools

## Testing Guidelines

### Unit Tests

```typescript
// Vue component test
import { mount } from '@vue/test-utils'
import ApiConfig from '@/components/ApiConfig.vue'

describe('ApiConfig', () => {
  it('validates email format', () => {
    // test implementation
  })
})
```

```rust
// Rust test
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_api_validation() {
        // test implementation
    }
}
```

### Integration Tests

Test IPC communication between frontend and backend:

```typescript
import { invoke } from '@tauri-apps/api/core'

// Test command invocation
const result = await invoke('test_api_connection')
expect(result.success).toBe(true)
```

## Documentation

### Code Documentation

```rust
/// Creates a new secret via the OTS API
///
/// # Arguments
/// * `request` - The secret creation request
///
/// # Returns
/// `CreateSecretResponse` with secret link and keys
///
/// # Errors
/// Returns `AppError` if the API request fails
pub async fn create_secret(&self, request: &CreateSecretRequest) -> AppResult<CreateSecretResponse> {
    // implementation
}
```

```typescript
/**
 * Repository for secret operations
 * @returns Object with secret operation methods
 */
export function useSecretRepository() {
  // implementation
}
```

### User Documentation

Update relevant sections when adding features:
- README.md - Overview and quick start
- BUILD.md - Build instructions
- API documentation - If adding endpoints

## Coding Standards

### Rust

- Use `rustfmt` for formatting
- Run `clippy` for linting
- Prefer `Result` over `panic!`
- Use `thiserror` for error types
- Add `#[must_use]` where appropriate
- Write doc comments for public APIs

### TypeScript

- Use strict mode
- Avoid `any` type
- Prefer `const` over `let`
- Use async/await over promises
- Handle all error cases
- Use descriptive variable names

### Vue

- Use Composition API
- Keep components focused
- Extract reusable logic to composables
- Use TypeScript for props
- Emit events with proper types
- Follow Vue 3 style guide

## Review Process

1. **Automated Checks**
   - Type checking
   - Linting
   - Tests
   - Build verification

2. **Code Review**
   - Maintainer reviews code
   - Feedback provided
   - Requested changes made
   - Approved when ready

3. **Merge**
   - Squash and merge
   - Delete branch
   - Close related issues

## Questions?

- Open a discussion on GitHub
- Ask in pull request comments
- Check existing issues and discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
