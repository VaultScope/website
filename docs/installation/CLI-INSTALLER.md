# VaultScope CLI Installer

Unified installer for all VaultScope components: Website (Storefront), API (VAMOS), and Admin Panel (CAMOS).

## Features

- **Unified Release Channel (`dev` vs `main`)**: Prompts the user to select the release branch across all repositories, ensuring full schema and API compatibility stack-wide.
- **Automated Database Setup & Seeding**: Runs all 11 database migrations and seeds a complete dataset (roles, staff, customers, products, connectors, coupons) without needing `sqlx-cli`.
- **Authentik-Free Mode (Default)**: Cleanly excludes Authentik for lightweight local development and testing, providing 1-click Dev Login personas and mock OIDC flows.
- **Cryptographic Key Generation**: Automatically generates cryptographically strong keys for `JWT_SECRET` (64-byte base64) and `ENCRYPTION_KEY` (32-byte hex).
- **Docker Compose Ready**: Full-stack compose file includes database, redis, backend, and frontends with Authentik disabled by default.

---

## Quick Start

```bash
# Standard interactive install (prompts for dev vs main branch)
node install-vaultscope.js

# Fast local install on active dev branch (repos already cloned)
node install-vaultscope.js --dev --skip-git -y

# Install from stable main branch
node install-vaultscope.js --main -y

# Install specific components
node install-vaultscope.js --components=api,website --dev

# Non-interactive / headless setup
node install-vaultscope.js --yes
```

---

## Unified Release Channel Strategy

### Why Branch Selection Cannot Be Per-Repo
The Storefront, API, and Admin panel are tightly coupled through:
- Database schema migrations and data shapes
- REST API contracts and endpoints
- JWT token claims and authentication handshakes

Future updates frequently land on the `dev` branch and may not be immediately backported to `main`. Allowing mixed branches (e.g. `website: main, api: dev`) introduces runtime incompatibilities. Therefore, the installer applies your choice of `dev` or `main` **globally across all repositories**.

When running interactively, the installer prompts:
```text
Choose Release Channel / Branch (applied to ALL repositories):
  1) dev  - Latest active development (Recommended; required for upcoming updates)
  2) main - Production stable releases
```

---

## Command Line Options

| Option | Default | Description |
|---|---|---|
| `--branch=<name>` | `dev` | Git branch to checkout or clone across all repositories |
| `--dev` | - | Shortcut for `--branch=dev` (latest active development) |
| `--main` | - | Shortcut for `--branch=main` (production stable releases) |
| `--components=<list>` | `all` | Comma-separated components (`api`, `website`, `admin`, or `all`) |
| `--exclude-authentik` | `true` | Exclude Authentik and activate local dev auth & mock OIDC |
| `--with-authentik` | `false` | Include full Authentik integration |
| `--seed` | `true` | Apply comprehensive test and development seed data |
| `--no-seed` | `false` | Apply migrations only without test seed data |
| `--skip-deps` | `false` | Skip running `npm install` |
| `--skip-env` | `false` | Skip creating / configuring `.env` files |
| `--overwrite-env` | `false` | Overwrite existing `.env` files with freshly generated secrets |
| `--skip-git` | `false` | Skip git fetch / pull on existing local directories |
| `-y`, `--yes` | `false` | Auto-confirm all prompts (non-interactive mode) |

---

## Components & Default Ports

| Component | Directory | Local Dev Port | Docker Compose Port | Technology |
|---|---|---|---|---|
| **API (VAMOS)** | `VaultScope-API/` | `http://localhost:3000` | `http://localhost:8000` | Rust, Axum, SQLx, Tokio |
| **Storefront** | `VaultScope/` | `http://localhost:5174` | `http://localhost:3000` | React 19, Vite, Tailwind 4 |
| **Admin (CAMOS)** | `VaultScope-Admin/` | `http://localhost:5173` | `http://localhost:3001` | React 19, Vite, Tailwind 4 |
| **PostgreSQL** | Docker | `5432` | `5432` | PostgreSQL 16 Alpine |
| **Redis** | Docker | `6379` | `6379` | Redis 7 Alpine |

---

## Authentik Exclusion & Pre-Seeded Personas

When Authentik is excluded (the default setting), authentication is handled via local JWT signing and pre-seeded database records.

### Staff Accounts (Admin Panel)
Navigate to `http://localhost:5173` (or `http://localhost:3001` in Docker). Use the **1-Click Dev Login** buttons:

| Persona | Email | Role | Permissions |
|---|---|---|---|
| **admin1** (Owner) | `admin1@test.local` | `Owner` | `*` (Full superadmin) |
| **support1** | `support1@test.local` | `Support` | Tickets, Customers, Service viewing |
| **billing1** | `billing1@test.local` | `Billing` | Invoices, Transactions, Refunds, Coupons |
| **tech1** | `tech1@test.local` | `Technical` | Servers, Connectors, IP Management |

### Customer Accounts (Storefront)
Navigate to `http://localhost:5174` (or `http://localhost:3000` in Docker):

| Persona | Email | Details |
|---|---|---|
| **customer1** | `customer1@test.local` | Anton Schmidt (Active, verified customer with existing services) |
| **customer2** | `max@example.com` | Max Mustermann |

### Direct Dev-Login API Endpoint
You can obtain a valid JWT token directly via HTTP:
```bash
curl -X POST http://localhost:3000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"persona": "admin1"}'
```

---

## Standalone Database Migrations & Seeding

If you only want to initialize or reseed the database at any time:

```bash
node scripts/setup-db.js
```

This runs against the active PostgreSQL container or local service, initializes the schema, applies migrations `0001` through `0011`, and loads all seed data.

---

## Docker Quickstart

To run the entire stack with Docker (Authentik is excluded by default):

```bash
# Start PostgreSQL, Redis, API, Storefront, and Admin
docker compose -f VaultScope/docker-compose.full-stack.yml up -d

# Check status of containers
docker compose -f VaultScope/docker-compose.full-stack.yml ps
```
