# Documentation Index

Welcome to the Portal API Generator documentation! This index helps you find the information you need quickly.

## 📚 Documentation Overview

### Getting Started
- **[README](../README.md)** - Project overview, quick start, and basic usage
- **[Examples](./EXAMPLES.md)** - Practical tutorials and use cases
- **[Installation Guide](../README.md#installation)** - Setup instructions and requirements

### Development
- **[Development Guide](./DEVELOPMENT.md)** - Comprehensive development workflow and best practices
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project
- **[Architecture](./ARCHITECTURE.md)** - System design and component overview

### Reference
- **[API Documentation](./API.md)** - Detailed API endpoint and schema information
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Changelog](../CHANGELOG.md)** - Version history and release notes

### Legal
- **[License](../LICENSE)** - MIT license and third-party acknowledgments

## 🔍 Find What You Need

### I want to...

#### **Get started quickly**
→ Read the [README](../README.md) and follow the [Quick Start Tutorial](./EXAMPLES.md#quick-start-tutorial)

#### **Set up the development environment**
→ Follow the [Development Guide](./DEVELOPMENT.md#environment-setup)

#### **Add a new API endpoint**
→ See [Adding New Endpoints](./EXAMPLES.md#use-case-1-adding-a-new-portal-endpoint)

#### **Understand the project architecture**
→ Read the [Architecture Overview](./ARCHITECTURE.md)

#### **Troubleshoot an issue**
→ Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)

#### **Contribute to the project**
→ Read the [Contributing Guidelines](./CONTRIBUTING.md)

#### **Use generated schemas in my app**
→ See [Common Use Cases](./EXAMPLES.md#common-use-cases)

#### **Learn about API endpoints**
→ Browse the [API Documentation](./API.md)

## 📖 Documentation Categories

### 🚀 **User Documentation**
For developers using Portal API Generator in their projects:

| Document | Description | Target Audience |
|----------|-------------|-----------------|
| [README](../README.md) | Project overview and quick start | All users |
| [Examples](./EXAMPLES.md) | Practical tutorials and use cases | Developers |
| [API Documentation](./API.md) | Endpoint reference and schemas | Developers |
| [Troubleshooting](./TROUBLESHOOTING.md) | Problem resolution | All users |

### 🛠️ **Developer Documentation**
For contributors and maintainers:

| Document | Description | Target Audience |
|----------|-------------|-----------------|
| [Development Guide](./DEVELOPMENT.md) | Development workflow and setup | Contributors |
| [Contributing](./CONTRIBUTING.md) | Contribution guidelines | Contributors |
| [Architecture](./ARCHITECTURE.md) | System design and patterns | Maintainers |

### 📋 **Reference Documentation**
Historical and legal information:

| Document | Description | Target Audience |
|----------|-------------|-----------------|
| [Changelog](../CHANGELOG.md) | Version history | All users |
| [License](../LICENSE) | Legal terms and attributions | All users |

## 🎯 Quick Reference

### Common Commands
```bash
# Generate all schemas
npm run generate:details
npm run generate:create

# Development setup
git clone --recursive https://github.com/elbasel42/portal-api-gen.git
cd portal-api-gen
pnpm install

# Troubleshooting
DEBUG=portal-api-gen:* npm run generate:details
```

### Key File Locations
```
portal-api-gen/
├── README.md                 # Main documentation entry point
├── lib/endpoints.json        # Endpoint configurations
├── scripts/generate.*.ts     # Generation scripts
├── utils/                    # Utility modules
├── schemas/                  # Generated output
└── docs/                     # Detailed documentation
    ├── API.md               # API reference
    ├── ARCHITECTURE.md      # System design
    ├── CONTRIBUTING.md      # Contribution guide
    ├── DEVELOPMENT.md       # Dev workflow
    ├── EXAMPLES.md          # Tutorials
    └── TROUBLESHOOTING.md   # Problem solving
```

### Important Links
- **GitHub Repository**: https://github.com/elbasel42/portal-api-gen
- **Issues**: https://github.com/elbasel42/portal-api-gen/issues
- **Discussions**: https://github.com/elbasel42/portal-api-gen/discussions

## 🔄 Documentation Updates

This documentation is continuously improved. Recent updates:

- **Latest**: Comprehensive documentation overhaul with examples and guides
- **Architecture**: Added detailed system design documentation
- **Troubleshooting**: Added common issues and solutions
- **Examples**: Added practical tutorials and use cases

## 🤝 Contributing to Documentation

Found a mistake or want to improve the documentation?

1. **Quick fixes**: Edit directly on GitHub and submit a PR
2. **Major changes**: Follow the [Contributing Guide](./CONTRIBUTING.md)
3. **New examples**: Add to [Examples](./EXAMPLES.md)
4. **FAQ items**: Add to [Troubleshooting](./TROUBLESHOOTING.md)

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Follow markdown formatting conventions
- Update this index when adding new documents
- Cross-reference related documentation

## 📞 Get Help

If you can't find what you're looking for:

1. **Search existing documentation** using your browser's search (Ctrl/Cmd + F)
2. **Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)** for common issues
3. **Browse [GitHub Issues](https://github.com/elbasel42/portal-api-gen/issues)** for known problems
4. **Start a [Discussion](https://github.com/elbasel42/portal-api-gen/discussions)** for questions
5. **Create an [Issue](https://github.com/elbasel42/portal-api-gen/issues/new)** for bugs or feature requests

---

*Happy coding! 🎉*