# Getting Started with VaultScope

**A comprehensive guide for developers new to the VaultScope project.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Running Locally](#running-locally)
6. [Running Tests](#running-tests)
7. [Development Workflow](#development-workflow)
8. [Deployment](#deployment)
9. [Documentation](#documentation)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is VaultScope?

VaultScope is a hosting management platform that enables customers to order, manage, and monitor cloud infrastructure services. It consists of three main components:

1. **Storefront** (React/TypeScript) - Customer-facing portal
2. **Admin Panel** (React/TypeScript) - Staff management dashboard
3. **API** (Rust/Actix-web) - Backend REST API

### Key Features

- **Multi-language Support** - English and German locales
- **OIDC Authentication** - Secure authentication via Authentik
- **Role-Based Access Control** - 4 roles (Owner, Support, Billing, Technical)
- **Infrastructure Automation** - Hetzner connector for server provisioning
- **Billing Integration** - Invoice and payment management
- **Ticketing System** - Customer support workflow

### Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router v6
- i18next (internationalization)
- Tailwind CSS

**Backend:**
- Rust 1.75+
- Actix-web 4
- SQLx (PostgreSQL)
- Tokio (async runtime)
- AES-256-GCM encryption

**Infrastructure:**
- PostgreSQL 16
- Redis 7
- Authentik (OIDC provider)
- Docker / Docker Compose
- Nginx / Caddy (reverse proxy)

---

## Architecture

### System Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Customer Browser                       │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│               Storefront (React/Vite)                     │
│                  localhost:3000                           │
│  - Public pages (home, pricing, contact)                 │
│  - German/English locale switcher                        │
│  - Customer dashboard (authenticated)                    │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  Authentik OIDC        │
         │  localhost:9000        │
         │  - User authentication │
         │  - Group management    │
         │  - Token issuance      │
         └────────┬───────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│                 Admin Panel (React/Vite)                  │
│                   localhost:3001                          │
│  - Staff authentication (OIDC)                           │
│  - Role-based sidebar (Owner/Support/Billing/Technical)  │
│  - User, server, invoice, ticket management              │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│                  API (Rust/Actix-web)                     │
│                    localhost:8000                         │
│  - JWT validation and RBAC middleware                    │
│  - PostgreSQL integration (SQLx)                         │
│  - Redis rate limiting                                   │
│  - Hetzner connector (server provisioning)               │
│  - Email templates and SMTP                              │
└─────────────────────┬────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL 16  │    │     Redis 7      │
│   localhost:5432 │    │  localhost:6379  │
│  - vaultscope DB │    │  - Rate limiting │
│  - authentik DB  │    │  - Session cache │
└──────────────────┘    └──────────────────┘
```

### Directory Structure

```
D:\Projects\Pegasus\
├── VaultScope/                  # Storefront (React)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── i18n/                # Translations (en/de)
│   │   └── App.tsx              # Main application
│   ├── public/                  # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── VaultScope-Admin/            # Admin Panel (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── VaultScope-API/              # Backend API (Rust)
    ├── src/
    │   ├── routes/              # API endpoints
    │   ├── auth/                # JWT/OIDC logic
    │   ├── middleware/          # RBAC, rate limiting
    │   ├── models/              # Database models
    │   └── main.rs              # Application entry
    ├── migrations/              # Database migrations
    ├── Cargo.toml
    └── sqlx-data.json           # SQLx offline mode
```

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 18+ | https://nodejs.org/ |
| **npm** | 9+ | Included with Node.js |
| **Rust** | 1.75+ | https://rustup.rs/ |
| **Docker** | 24+ | https://www.docker.com/ |
| **Docker Compose** | 2.20+ | Included with Docker Desktop |
| **Git** | 2.40+ | https://git-scm.com/ |
| **PostgreSQL Client** | 16+ | Optional (for direct DB access) |

### Optional Tools

- **VS Code** - Recommended IDE with Rust Analyzer and ESLint extensions
- **Postman** or **Insomnia** - API testing
- **pgAdmin** or **DBeaver** - Database management GUI

### System Requirements

- **OS:** Windows 10/11, macOS 12+, or Linux (Ubuntu 22.04+)
- **RAM:** 8 GB minimum, 16 GB recommended
- **Disk:** 10 GB free space
- **CPU:** 4 cores recommended

---

## Quick Start

### 5-Minute Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd VaultScope

# 2. Start infrastructure
docker-compose -f docker-compose.full-stack.yml up -d

# 3. Install frontend dependencies
npm install
cd ../VaultScope-Admin && npm install

# 4. Configure Authentik (follow prompts)
cd ../VaultScope/authentik-config
python configure-with-token.py <token>

# 5. Start development servers
cd ../VaultScope && npm run dev &
cd ../VaultScope-Admin && npm run dev &
cd ../VaultScope-API && cargo run
```

Open browser:
- Storefront: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:8000
- Authentik: http://localhost:9000

---

## Running Locally

### Step 1: Clone and Install

```bash
# Clone all three repositories
cd D:\Projects\Pegasus
git clone <repo-url-storefront> VaultScope
git clone <repo-url-admin> VaultScope-Admin
git clone <repo-url-api> VaultScope-API

# Install Node dependencies
cd VaultScope
npm install

cd ../VaultScope-Admin
npm install

# Build Rust dependencies (takes 5-10 minutes first time)
cd ../VaultScope-API
cargo build
```

### Step 2: Configure Environment

**Storefront (.env):**
```bash
cd D:\Projects\Pegasus\VaultScope
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:8000
VITE_ADMIN_URL=http://localhost:3001
VITE_AUTHENTIK_URL=http://localhost:9000
```

**Admin (.env):**
```bash
cd D:\Projects\Pegasus\VaultScope-Admin
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:8000
VITE_AUTHENTIK_URL=http://localhost:9000
```

**API (.env):**
```bash
cd D:\Projects\Pegasus\VaultScope-API
cp .env.example .env

# Edit .env:
DATABASE_URL=postgresql://postgres:postgres_dev@localhost:5432/vaultscope
REDIS_URL=redis://localhost:6379
AUTHENTIK_ISSUER=http://localhost:9000/application/o/vaultscope-admin/
AUTHENTIK_CLIENT_ID_ADMIN=vaultscope-admin
AUTHENTIK_CLIENT_SECRET_ADMIN=<generated-by-authentik>
AUTHENTIK_CLIENT_ID_STOREFRONT=vaultscope-storefront
AUTHENTIK_CLIENT_SECRET_STOREFRONT=<generated-by-authentik>
ENCRYPTION_KEY=<generate-32-byte-base64-key>
JWT_SECRET=<generate-random-secret>
```

**Generate secrets:**
```bash
# Encryption key (32 bytes base64)
openssl rand -base64 32

# JWT secret
openssl rand -hex 32
```

### Step 3: Start Infrastructure

```bash
cd D:\Projects\Pegasus\VaultScope

# Start all services
docker-compose -f docker-compose.full-stack.yml up -d

# Verify all services running
docker-compose -f docker-compose.full-stack.yml ps

# Expected output:
# postgres         running   5432
# redis            running   6379
# authentik-server running   9000
# authentik-worker running   -
# api              running   8000
# storefront       running   3000
# admin            running   3001
```

### Step 4: Configure Authentik

See detailed guide: `authentik-config/QUICKSTART.md`

**Quick version:**
1. Open http://localhost:9000
2. Login: admin@localhost / admin
3. Navigate: Directory → Tokens → Create
4. Copy token
5. Run: `python authentik-config/configure-with-token.py <token>`

### Step 5: Start Development Servers

**Terminal 1 (Storefront):**
```bash
cd D:\Projects\Pegasus\VaultScope
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 (Admin):**
```bash
cd D:\Projects\Pegasus\VaultScope-Admin
npm run dev
# Opens http://localhost:3001
```

**Terminal 3 (API):**
```bash
cd D:\Projects\Pegasus\VaultScope-API
cargo run
# Listens on http://localhost:8000
```

---

## Running Tests

### Unit Tests

**Storefront:**
```bash
cd D:\Projects\Pegasus\VaultScope
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- WaitlistForm    # Specific test
```

**Admin:**
```bash
cd D:\Projects\Pegasus\VaultScope-Admin
npm test
```

**API:**
```bash
cd D:\Projects\Pegasus\VaultScope-API
cargo test                  # Run all tests
cargo test --test integration  # Integration tests only
cargo test -- --nocapture   # Show output
```

### End-to-End Tests

**Install Playwright:**
```bash
cd D:\Projects\Pegasus\VaultScope
npx playwright install
```

**Run E2E tests:**
```bash
# Headless mode
npx playwright test

# Headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Specific test
npx playwright test e2e/storefront/homepage.spec.ts
```

**View report:**
```bash
npx playwright show-report
```

### Test Coverage

```bash
# Storefront coverage
cd D:\Projects\Pegasus\VaultScope
npm run test:coverage

# API coverage
cd D:\Projects\Pegasus\VaultScope-API
cargo tarpaulin --out Html
```

---

## Development Workflow

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Make changes
# Edit files...

# 3. Test changes
npm test                    # Frontend
cargo test                  # API

# 4. Commit
git add .
git commit -m "feat: add new feature"

# 5. Push and create PR
git push origin feature/my-new-feature
```

### Coding Standards

**TypeScript/JavaScript:**
- Use ESLint configuration (`.eslintrc`)
- Run `npm run lint` before commit
- Use Prettier for formatting
- Follow React hooks rules

**Rust:**
- Use `cargo fmt` for formatting
- Run `cargo clippy` for linting
- Follow Rust API guidelines
- Document public functions

**Commit Messages:**
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Be descriptive: `feat(auth): add OIDC state validation`

### Database Migrations

**Create new migration:**
```bash
cd D:\Projects\Pegasus\VaultScope-API

# Create migration file
sqlx migrate add create_new_table

# Edit generated file in migrations/
# Write UP and DOWN migrations

# Apply migration
sqlx migrate run

# Verify migration
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT version FROM _sqlx_migrations;"
```

**Offline mode (for CI/CD):**
```bash
# Prepare SQLx data for offline compilation
cargo sqlx prepare

# This creates sqlx-data.json
# Commit this file to version control
```

---

## Deployment

### Building for Production

**Frontend (Storefront):**
```bash
cd D:\Projects\Pegasus\VaultScope

# Set production environment variables
export VITE_API_URL=https://api.vaultscope.com
export VITE_ADMIN_URL=https://admin.vaultscope.com

# Build
npm run build

# Output: dist/ directory
```

**Frontend (Admin):**
```bash
cd D:\Projects\Pegasus\VaultScope-Admin

export VITE_API_URL=https://api.vaultscope.com

npm run build
```

**Backend (API):**
```bash
cd D:\Projects\Pegasus\VaultScope-API

# Build release binary
cargo build --release

# Output: target/release/vaultscope-api
```

### Docker Deployment

**Build images:**
```bash
# Storefront
cd D:\Projects\Pegasus\VaultScope
docker build -t vaultscope-storefront:latest \
  --build-arg VITE_API_URL=https://api.vaultscope.com \
  .

# Admin
cd D:\Projects\Pegasus\VaultScope-Admin
docker build -t vaultscope-admin:latest \
  --build-arg VITE_API_URL=https://api.vaultscope.com \
  .

# API
cd D:\Projects\Pegasus\VaultScope-API
docker build -t vaultscope-api:latest .
```

**Deploy with docker-compose:**
```bash
# Production docker-compose.yml
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Configuration

**Development:**
- HTTP only
- Simple passwords
- Debug logging
- Local PostgreSQL

**Staging:**
- HTTPS with self-signed cert
- Stronger passwords
- Info logging
- Separate database

**Production:**
- HTTPS with valid cert
- Strong passwords, MFA
- Error logging only
- Managed PostgreSQL (RDS, etc.)
- Redis cluster
- Load balancer
- Monitoring and alerting

---

## Documentation

### Where to Find Information

| Topic | Document |
|-------|----------|
| **Quick commands** | QUICK_REFERENCE.md |
| **QA results** | FINAL_QA_REPORT.md |
| **Known issues** | ISSUE_TRACKER.md |
| **Picking up work** | HANDOFF.md |
| **Cleanup** | CLEANUP.md |
| **This guide** | GETTING_STARTED.md |
| **Authentik setup** | authentik-config/QUICKSTART.md |
| **Database schema** | database-verification/schema-report.json |

### API Documentation

**Endpoints:**
```bash
# Health check
GET /api/health

# Public endpoints
POST /api/auth/register
POST /api/waitlist
POST /api/contact

# Customer endpoints (JWT required)
GET /api/customer/servers
GET /api/customer/invoices
POST /api/customer/servers/order

# Admin endpoints (JWT + RBAC)
GET /api/admin/users
POST /api/admin/users
GET /api/admin/servers
POST /api/admin/servers/{id}/power
```

**Authentication:**
```bash
# Get JWT via OIDC flow
# 1. Redirect to Authentik: /auth/login
# 2. User authenticates
# 3. Callback: /auth/callback
# 4. JWT returned

# Use JWT in requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/customer/servers
```

---

## Troubleshooting

### Common Issues

#### Services Won't Start

**Problem:** Port already in use

```bash
# Check what's using port
netstat -ano | findstr :8000

# Kill process
taskkill /PID <pid> /F
```

**Problem:** Docker out of space

```bash
# Clean up Docker
docker system prune -a --volumes
```

#### Authentication Not Working

**Problem:** Invalid JWT

```bash
# Check API logs
docker-compose -f docker-compose.full-stack.yml logs api

# Verify Authentik configuration
bash authentik-config/test-oidc.sh

# Check JWT claims at jwt.io
```

**Problem:** OIDC redirect loop

```bash
# Verify client secrets match
cat authentik-config/oidc-providers.json
grep CLIENT_SECRET docker-compose.full-stack.yml

# Restart API after fixing
docker-compose -f docker-compose.full-stack.yml restart api
```

#### Database Connection Failed

**Problem:** Can't connect to PostgreSQL

```bash
# Check PostgreSQL running
docker-compose -f docker-compose.full-stack.yml ps postgres

# Test connection
docker exec -it vaultscope-postgres psql -U postgres

# Check DATABASE_URL in .env
cat VaultScope-API/.env | grep DATABASE_URL
```

#### Tests Failing

**Problem:** Integration tests need PostgreSQL

```bash
# Set TEST_DATABASE_URL
export TEST_DATABASE_URL=postgresql://postgres:postgres_dev@localhost:5432/vaultscope_test

# Run tests
cargo test
```

### Getting Help

**Check logs:**
```bash
# All services
docker-compose -f docker-compose.full-stack.yml logs -f

# Specific service
docker-compose -f docker-compose.full-stack.yml logs -f api
```

**Verify configuration:**
```bash
# Check environment variables loaded
docker exec vaultscope-api env | grep DATABASE_URL

# Check API health
curl http://localhost:8000/api/health
```

**Reset everything:**
```bash
# Nuclear option - deletes all data
docker-compose -f docker-compose.full-stack.yml down -v
rm -rf node_modules/ dist/ target/

# Start fresh
npm install
cargo build
docker-compose -f docker-compose.full-stack.yml up -d
```

---

## Next Steps

### After Setup

1. **Read the QA report:** `FINAL_QA_REPORT.md` for system overview
2. **Review known issues:** `ISSUE_TRACKER.md` for current problems
3. **Check pending work:** `HANDOFF.md` for what's next
4. **Explore the codebase:** Start with `src/main.rs` (API) and `src/App.tsx` (frontends)

### Learning Resources

**Rust:**
- The Rust Book: https://doc.rust-lang.org/book/
- Actix-web Guide: https://actix.rs/docs/
- SQLx Docs: https://docs.rs/sqlx/

**React:**
- React Docs: https://react.dev/
- Vite Guide: https://vitejs.dev/guide/
- React Router: https://reactrouter.com/

**PostgreSQL:**
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- SQLx Migrations: https://github.com/launchbadge/sqlx/tree/main/sqlx-cli

**OIDC:**
- Authentik Docs: https://docs.goauthentik.io/
- OpenID Connect: https://openid.net/connect/

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-12  
**For Questions:** See HANDOFF.md for team contacts

**Welcome to VaultScope development!**
