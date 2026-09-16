# VaultScope Documentation

Complete documentation for VaultScope deployment, operation, and development.

## 📚 Documentation Structure

### Installation & Deployment
- **[Installation Guide](installation/INSTALL.md)** - Complete production installation guide with prerequisites, troubleshooting, and security features
- **[CLI Installer](installation/CLI-INSTALLER.md)** - Node.js CLI tool for local development setup with branch selection
- **[Deployment Guide](deployment/DEPLOYMENT.md)** - Production deployment strategies and best practices

### Operations
- **[Operations Runbook](operations/RUNBOOK.md)** - Day-to-day operations, monitoring, and maintenance procedures

### Development
See [/documentation](../documentation/) folder for:
- Getting Started
- Architecture Overview
- Development Guide
- API Integration
- Authentication System
- Internationalization (i18n)
- Testing Guide
- Configuration Reference
- FAQ

## 🚀 Quick Links

### For First-Time Users
1. [Getting Started](../documentation/GETTING_STARTED.md)
2. [Installation Guide](installation/INSTALL.md)
3. [Configuration](../documentation/CONFIGURATION.md)

### For Developers
1. [Development Guide](../documentation/DEVELOPMENT.md)
2. [Architecture](../documentation/ARCHITECTURE.md)
3. [Testing](../documentation/TESTING.md)

### For Operators
1. [Deployment Guide](deployment/DEPLOYMENT.md)
2. [Operations Runbook](operations/RUNBOOK.md)
3. [FAQ](../documentation/FAQ.md)

## 📋 Installation Methods

### Production (One-Command)
```bash
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash
```

See [Installation Guide](installation/INSTALL.md) for details.

### Local Development (CLI Tool)
```bash
node install-vaultscope.js --dev -y
```

See [CLI Installer](installation/CLI-INSTALLER.md) for all options.

### Docker Compose (Full Stack)
```bash
docker-compose -f docker-compose.full-stack.yml up -d
```

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/VaultScope/website/issues)
- **Email**: support@vaultscope.de
- **Documentation**: You're reading it!

## 📄 License

See [LICENSE](../LICENSE) in the root directory.
