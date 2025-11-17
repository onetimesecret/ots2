# Contributing to OneTimeSecret Desktop

Thank you for your interest in contributing to OneTimeSecret Desktop! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ots2.git
   cd ots2
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the App

```bash
npm run tauri:dev
```

This starts the development server with hot-reload enabled.

### Testing Changes

Before submitting a pull request:

1. **Type check**: `npm run build` (Vue type checking)
2. **Run the app**: `npm run tauri:dev`
3. **Test all features**: Create secrets, retrieve secrets, check settings
4. **Test on your platform**: Ensure it works on your OS

### Code Style

- **TypeScript**: Use strict mode, define all types
- **Vue**: Use Composition API with `<script setup>`
- **Rust**: Follow standard Rust conventions
- **Formatting**: Use consistent indentation (see `.editorconfig`)

## Security Guidelines

This is a security-focused application. Please follow these guidelines:

### Do's

- ✅ Handle all API calls in Rust backend
- ✅ Use type-safe IPC between frontend and backend
- ✅ Store sensitive data in secure storage
- ✅ Validate all inputs
- ✅ Follow principle of least privilege
- ✅ Document security-critical code

### Don'ts

- ❌ Never make direct API calls from the frontend
- ❌ Never store secrets in localStorage
- ❌ Never disable security features (CSP, etc.)
- ❌ Never log sensitive information
- ❌ Never hardcode credentials or API keys

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Test thoroughly** on your platform
3. **Write clear commit messages**:
   ```
   feat: add batch secret creation
   fix: resolve memory leak in secret retrieval
   docs: update installation instructions
   ```
4. **Create a pull request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes
   - Testing steps

### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Build process, dependencies, etc.

## Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**:
   - OS and version
   - Node.js version
   - Rust version
   - App version
6. **Logs**: Relevant error messages or logs

## Suggesting Features

When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case**: Why is this needed?
3. **Propose a solution**: How should it work?
4. **Consider security**: Any security implications?

## Areas for Contribution

We especially welcome contributions in these areas:

- **Features**: New functionality (see Roadmap in README)
- **Bug fixes**: Address reported issues
- **Documentation**: Improve guides and API docs
- **Testing**: Add tests and improve coverage
- **Security**: Security audits and improvements
- **Internationalization**: Translate to other languages
- **Performance**: Optimize application performance

## Project Structure

Understanding the codebase:

```
src/                 # Vue frontend
├── components/      # UI components
├── composables/     # Reusable composition functions
├── stores/          # Pinia state management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

src-tauri/          # Rust backend
├── src/            # Rust source code
└── capabilities/   # Tauri permission definitions
```

## Questions?

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to OneTimeSecret Desktop! 🎉
