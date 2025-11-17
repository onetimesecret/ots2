# Contributing to OneTimeSecret Desktop

Thank you for your interest in contributing to OneTimeSecret Desktop! This document provides guidelines and information for contributors.

## Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

## Getting Started

1. **Fork the repository** and clone your fork
2. **Install dependencies:** `npm install`
3. **Set up your development environment** (see [BUILD.md](BUILD.md))
4. **Create a branch** for your feature or bug fix
5. **Make your changes** following the coding guidelines below
6. **Test your changes** thoroughly
7. **Submit a pull request**

## Development Workflow

### Running the Application

```bash
# Development mode with hot-reload
npm run tauri:dev

# Build for production
npm run tauri:build
```

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd src-tauri
cargo test
```

### Code Style

#### TypeScript/Vue
- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep components focused and single-purpose

#### Rust
- Follow Rust naming conventions
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Add doc comments for public items
- Handle errors explicitly (no unwrap in production code)

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(api): add support for custom TTL values

- Allow users to specify custom TTL in seconds
- Add validation for TTL range
- Update UI to show custom TTL option

Closes #123
```

## Security Guidelines

### Critical Rules

1. **Never commit secrets** - No API keys, passwords, or credentials
2. **Validate all inputs** - Both client-side and server-side
3. **Use secure storage** - Never store sensitive data in localStorage
4. **Follow CSP rules** - Don't weaken Content Security Policy
5. **Minimize permissions** - Only request necessary capabilities
6. **HTTPS only** - All external communication must use HTTPS

### Security Checklist for PRs

- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user inputs
- [ ] Error messages don't leak sensitive information
- [ ] No unnecessary permissions added
- [ ] Dependencies are up-to-date and audited
- [ ] CSP rules not weakened
- [ ] Secure storage used for sensitive data

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features or bug fixes
3. **Ensure all tests pass** before submitting
4. **Update the README** if needed
5. **Reference related issues** in the PR description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Security Impact
Any security implications?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Security checklist reviewed
- [ ] No secrets committed
```

## Architecture Guidelines

### Frontend (Vue/TypeScript)

```
src/
├── components/      # Vue components
├── stores/         # Pinia state stores
├── services/       # Business logic and API calls
├── types/          # TypeScript type definitions
└── main.ts         # Application entry
```

**Guidelines:**
- Keep components presentational when possible
- Move business logic to stores or services
- Use TypeScript interfaces for type safety
- Avoid prop drilling - use stores for global state

### Backend (Rust)

```
src-tauri/src/
├── api.rs          # External API client
├── commands.rs     # Tauri IPC handlers
├── storage.rs      # Secure storage
├── error.rs        # Error types
└── lib.rs          # Library entry
```

**Guidelines:**
- Use descriptive error types
- Implement proper async/await patterns
- Add unit tests for business logic
- Keep commands thin - delegate to modules

## Testing Guidelines

### Frontend Tests

Use Vitest for Vue component testing:

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent);
    expect(wrapper.text()).toContain('Expected text');
  });
});
```

### Backend Tests

Use Rust's built-in test framework:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function() {
        let result = my_function();
        assert_eq!(result, expected_value);
    }

    #[tokio::test]
    async fn test_async_function() {
        let result = my_async_function().await;
        assert!(result.is_ok());
    }
}
```

## Documentation

- Update README.md for user-facing changes
- Update BUILD.md for build process changes
- Add inline comments for complex logic
- Use JSDoc/rustdoc for API documentation

## Questions?

If you have questions:
- Check existing issues and discussions
- Read the documentation in BUILD.md
- Ask in a new GitHub issue
- Be specific about your question or problem

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to OneTimeSecret Desktop!
