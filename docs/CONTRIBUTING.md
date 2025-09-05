# Contributing to Portal API Generator

Thank you for your interest in contributing to Portal API Generator! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Report issues with the existing functionality
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve documentation, examples, or tutorials
- **Testing**: Add or improve test coverage

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Bun**: Latest version installed (`curl -fsSL https://bun.sh/install | bash`)
- **Node.js**: Version 18+ (if not using Bun)
- **Git**: For version control
- **TypeScript**: Familiarity with TypeScript development

### Development Setup

1. **Fork the repository**:
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/portal-api-gen.git
   cd portal-api-gen
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Verify setup**:
   ```bash
   npm run generate:details
   ```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Add appropriate comments
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   # Run the generation scripts to test
   npm run generate:details
   npm run generate:create
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # or
   git commit -m "fix: resolve issue description"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   # Then create a pull request on GitHub
   ```

## 📝 Code Guidelines

### TypeScript Standards

- **Strict mode**: All code must pass TypeScript strict mode
- **Type safety**: Avoid `any` types; prefer specific interfaces
- **Path aliases**: Use the defined path aliases in `tsconfig.json`

```typescript
// ✅ Good
import { getModelZodSchema } from '@utils/model';
import type { Endpoint } from '@type/endpoint';

// ❌ Avoid
import { getModelZodSchema } from '../../../utils/model';
```

### Code Style

- **Naming**: Use camelCase for variables/functions, PascalCase for types/interfaces
- **File names**: Use kebab-case for file names
- **Comments**: Add JSDoc comments for public APIs

```typescript
/**
 * Generates a Zod schema from JSON response data
 * @param modelName - Name for the generated model
 * @param jsonString - JSON string to convert
 * @returns Promise that resolves to the generated schema
 */
export async function getModelZodSchema(
  modelName: string, 
  jsonString: string
): Promise<string> {
  // Implementation
}
```

### Directory Structure

When adding new files, follow the existing structure:

```
utils/
├── http/           # HTTP-related utilities
├── model/          # Model generation utilities
├── io/             # File I/O operations
└── validation/     # Validation utilities (if adding)

constants/
├── paths/          # Path constants
└── config/         # Configuration constants

scripts/
├── generate.*.ts   # Generation scripts
└── helpers/        # Script helper functions
```

## 🧪 Testing

### Manual Testing

Before submitting a PR, test your changes by:

1. **Running existing scripts**:
   ```bash
   npm run generate:details
   npm run generate:create
   ```

2. **Verifying generated files**:
   - Check that schemas are valid
   - Ensure TypeScript compilation succeeds
   - Verify generated types are correct

3. **Testing edge cases**:
   - Invalid JSON responses
   - Missing endpoint configurations
   - Network failures

### Adding Test Cases

When adding new features, consider adding test scenarios:

```typescript
// Example: Test endpoint validation
const invalidEndpoint = {
  name: "",  // Invalid: empty name
  url: "test",
  method: "POST"
};

// Test should fail gracefully
```

## 📋 Pull Request Guidelines

### PR Title Format

Use conventional commit format:
- `feat: add new feature description`
- `fix: resolve bug description`
- `docs: update documentation`
- `refactor: improve code structure`
- `test: add test coverage`

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe):

## Testing
- [ ] Manual testing completed
- [ ] All existing scripts run successfully
- [ ] Edge cases considered

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks**: Ensure TypeScript compilation passes
2. **Code review**: Maintainers will review for:
   - Code quality and style
   - Performance implications
   - Security considerations
   - Backward compatibility

3. **Feedback**: Address review comments promptly
4. **Merge**: Once approved, maintainers will merge

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template with:

- **Environment details**: OS, Node/Bun version, TypeScript version
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Additional context**: Logs, screenshots, related issues

### Feature Requests

Use the feature request template with:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought of
- **Additional context**: Use cases, examples, mockups

## 🏷️ Issue Labels

We use these labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 💡 Development Tips

### Debugging Generation

To debug schema generation issues:

```typescript
// Add logging to generation scripts
console.log('Processing endpoint:', endpoint.name);
console.log('Response data:', JSON.stringify(response, null, 2));
```

### Working with Submodules

The `schemas` directory is a git submodule:

```bash
# Initialize submodule
git submodule update --init --recursive

# Update submodule
cd schemas
git pull origin main
cd ..
git add schemas
git commit -m "update schemas submodule"
```

### Path Aliases

Use the configured TypeScript path aliases:

```typescript
// Available aliases from tsconfig.json
import something from '@lib/file';
import helper from '@utils/helper';
import schema from '@schemas/endpoint/schema';
import type from '@type/interface';
import constant from '@constants/config';
```

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bugs or feature requests
- **Email**: [Contact information if available]

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to Portal API Generator! 🎉