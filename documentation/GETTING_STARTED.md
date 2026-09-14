# Getting Started with VaultScope Storefront

This guide will help you set up the VaultScope Storefront development environment from scratch.

## Prerequisites

### Required Software

1. **Node.js 22.x or higher**
   ```bash
   # Check your Node version
   node --version  # Should output v22.x.x or higher
   ```

   Download from [nodejs.org](https://nodejs.org/) if needed.

2. **npm 10.x or higher**
   ```bash
   # Check your npm version
   npm --version  # Should output 10.x.x or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

### Required Services

1. **VaultScope API (vamos)**
   - The storefront requires a running instance of the VaultScope API
   - See [vamos repository](https://github.com/VaultScope/vamos) for setup instructions
   - Default expected at: `http://localhost:3000/api`

2. **Authentik OIDC Provider**
   - Required for user authentication
   - Configure with a client ID for the storefront application
   - Default: `https://auth.vaultscope.de`

## Installation Steps

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/VaultScope/website.git

# Or via SSH
git clone git@github.com:VaultScope/website.git

cd website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Three.js
- And all development dependencies

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Required: API endpoint
VITE_API_URL=http://localhost:3000/api

# Required: Authentik configuration
VITE_AUTHENTIK_URL=https://auth.vaultscope.de
VITE_OIDC_CLIENT_ID=vaultscope-storefront
VITE_OIDC_REDIRECT_URI=http://localhost:5174/auth/callback

# Optional: Newsletter integration
# VITE_LISTMONK_URL=https://newsletter.vaultscope.de
# VITE_LISTMONK_LIST_UUID=your-list-uuid
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5174`

You should see output similar to:

```
  VITE v8.2.0  ready in 1234 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

### 5. Verify Installation

1. Open your browser to `http://localhost:5174`
2. You should see the VaultScope homepage
3. Navigate through the site to ensure all routes work
4. Try the authentication flow (requires Authentik to be configured)

## Common Issues

### Port Already in Use

If port 5174 is already in use:

```bash
# Use a different port
npm run dev -- --port 3001
```

Or kill the process using the port:

```bash
# On Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# On Linux/Mac
lsof -ti:5174 | xargs kill -9
```

### API Connection Errors

If you see API connection errors:

1. Verify the VaultScope API is running:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. Check your `VITE_API_URL` in `.env`

3. Ensure CORS is properly configured in the API

### Authentication Errors

If authentication fails:

1. Verify Authentik is accessible:
   ```bash
   curl https://auth.vaultscope.de/.well-known/openid-configuration
   ```

2. Check that your client ID matches Authentik configuration

3. Verify the redirect URI is registered in Authentik

4. Clear browser local storage and try again:
   ```javascript
   // In browser console
   localStorage.clear();
   ```

### Module Resolution Errors

If you encounter module resolution errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (requires dev server to be running)
npx playwright test

# Watch mode for unit tests
npm run test:watch
```

### Linting

```bash
# Run linter
npm run lint

# Lint will automatically run on git commit (pre-commit hook)
```

### Building

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Next Steps

- Read [DEVELOPMENT.md](DEVELOPMENT.md) for development best practices
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the codebase structure
- Check [API_INTEGRATION.md](API_INTEGRATION.md) to learn how the frontend communicates with the backend
- See [TESTING.md](TESTING.md) for testing guidelines

## Getting Help

- Check the [FAQ](FAQ.md) for common questions
- Open an issue on [GitHub](https://github.com/VaultScope/website/issues)
- Contact the team at support@vaultscope.de
