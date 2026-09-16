# VaultScope Storefront

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-22.x-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev)

The customer-facing website and dashboard for the VaultScope ecosystem. Built with React 19 and Vite, this application provides a modern, responsive interface for customers to browse infrastructure products, configure and order services, and manage their deployments in real-time.

## 🌟 Features

- **🛒 Dynamic Product Catalog**: Browse VPS, Dedicated Servers, and ODP (On-Demand Provisioning) configurations
- **⚡ Real-Time Ordering**: Step-by-step wizard for infrastructure deployment with instant provisioning
- **📊 Customer Dashboard**: Monitor active services, view invoices, and manage support tickets
- **💳 Payment Integration**: Secure Stripe integration for seamless checkout
- **🌍 Internationalization**: Full German and English support with `/de/` URL routing
- **🔐 Secure Authentication**: Authentik OIDC integration with CSRF protection
- **🎨 Modern UI**: Tailwind CSS 4, Framer Motion animations, and Three.js 3D visualizations

## 📋 Prerequisites

- **Node.js**: 22.x or higher
- **npm**: 10.x or higher
- **VaultScope-API**: Running instance of [vamos](https://github.com/VaultScope/vamos)
- **Authentik**: OIDC provider configured with storefront client

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/VaultScope/website.git
cd website

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
# nano .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5174`

### Development

```bash
# Run development server with hot reload
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Run E2E tests
npx playwright test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
vaultscope/
├── public/              # Static assets
│   ├── 3d/             # Three.js 3D models
│   └── logos/          # Brand assets
├── src/
│   ├── components/     # Reusable React components
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files (de/en)
│   ├── lib/            # Core utilities
│   │   ├── api.ts     # API client with CSRF protection
│   │   ├── auth.ts    # Authentication logic
│   │   └── hooks.ts   # Custom React hooks
│   ├── pages/          # Route components
│   ├── test/           # Test utilities
│   ├── App.tsx         # Main application component
│   └── index.css       # Global styles
├── e2e/                # Playwright E2E tests
├── scripts/            # Build scripts
└── documentation/      # Comprehensive documentation
```

## 🔧 Configuration

See [documentation/CONFIGURATION.md](documentation/CONFIGURATION.md) for detailed configuration options.

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | VaultScope API base URL | Yes | `http://localhost:3000/api` |
| `VITE_AUTHENTIK_URL` | Authentik OIDC provider URL | Yes | `https://auth.vaultscope.de` |
| `VITE_OIDC_CLIENT_ID` | OIDC client ID for storefront | Yes | `vaultscope-storefront` |
| `VITE_OIDC_REDIRECT_URI` | OAuth2 callback URL | Yes | `http://localhost:5174/auth/callback` |
| `VITE_LISTMONK_URL` | Newsletter service URL (optional) | No | - |
| `VITE_LISTMONK_LIST_UUID` | Newsletter list UUID (optional) | No | - |

## 📚 Documentation

### Quick Start Guides
- **[Installation Guide](docs/installation/INSTALL.md)** - Complete production installation (one command!)
- **[CLI Installer](docs/installation/CLI-INSTALLER.md)** - Local development setup tool
- **[Getting Started](documentation/GETTING_STARTED.md)** - Setup and configuration guide

### Deployment & Operations
- **[Deployment Guide](docs/deployment/DEPLOYMENT.md)** - Production deployment strategies
- **[Operations Runbook](docs/operations/RUNBOOK.md)** - Monitoring, maintenance, and troubleshooting

### Developer Documentation
See [/documentation](documentation/) for comprehensive technical guides:
- **[Development](documentation/DEVELOPMENT.md)** - Development workflows and best practices
- **[Architecture](documentation/ARCHITECTURE.md)** - Application architecture and design decisions
- **[API Integration](documentation/API_INTEGRATION.md)** - How the storefront integrates with VAMOS
- **[Authentication](documentation/AUTHENTICATION.md)** - OIDC authentication flow
- **[Internationalization](documentation/I18N.md)** - Adding and managing translations
- **[Testing](documentation/TESTING.md)** - Testing strategy and guidelines

### Project Policies
- **[Contributing](CONTRIBUTING.md)** - Contribution guidelines
- **[Security](SECURITY.md)** - Security policies and vulnerability reporting
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards

## 🏗️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript 6
- **Build Tool**: Vite 8
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Testing**: Vitest, React Testing Library, Playwright
- **Linting**: oxlint

## 🔒 Security

Security is a top priority. This application implements:

- **CSRF Protection**: Token-based CSRF validation for all state-changing operations
- **OIDC Authentication**: Industry-standard OAuth2/OIDC flow
- **Secure Token Storage**: JWT tokens with automatic expiration handling
- **CORS Protection**: Strict CORS policies enforced by the API
- **XSS Prevention**: React's built-in XSS protections
- **Input Validation**: Client-side validation with server-side enforcement

See [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities.

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# The output will be in the dist/ directory
# Serve with your preferred static file server
```

### Docker Deployment

```bash
# Build Docker image
docker build -t vaultscope-storefront .

# Run container
docker run -p 80:80 \
  -e VITE_API_URL=https://api.vaultscope.de/api \
  -e VITE_AUTHENTIK_URL=https://auth.vaultscope.de \
  vaultscope-storefront
```

See [Deployment Guide](docs/deployment/DEPLOYMENT.md) for comprehensive deployment instructions.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Generate test coverage
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **[vamos](https://github.com/VaultScope/vamos)** - VaultScope API backend (Rust/Axum)
- **[camos](https://github.com/VaultScope/camos)** - VaultScope Admin panel

## 📞 Support

- **Documentation**: [docs.vaultscope.de](https://docs.vaultscope.de)
- **Issues**: [GitHub Issues](https://github.com/VaultScope/website/issues)
- **Email**: support@vaultscope.de

---

Built with ❤️ by the VaultScope team
