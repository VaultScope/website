# VaultScope QA Quick Reference

**Quick access to commands, endpoints, and critical files for VaultScope QA process.**

---

## Service Endpoints

### Local Development Stack

| Service | URL | Credentials | Notes |
|---------|-----|-------------|-------|
| **Authentik** | http://localhost:9000 | admin@localhost / admin | OIDC provider |
| **VaultScope API** | http://localhost:8000 | JWT required | REST API |
| **Storefront** | http://localhost:3000 | - | Customer portal |
| **Admin Panel** | http://localhost:3001 | JWT required | Staff dashboard |
| **PostgreSQL** | localhost:5432 | postgres / postgres_dev | Database |
| **Redis** | localhost:6379 | - | Cache & rate limiting |

### Test User Accounts

| Username | Email | Password | Role | Purpose |
|----------|-------|----------|------|---------|
| customer1 | customer1@test.local | Customer123! | Customer | Test customer operations |
| customer2 | customer2@test.local | Customer123! | Customer | RBAC escalation testing |
| admin1 | admin1@test.local | Admin123! | Owner | Full admin access |
| support1 | support1@test.local | Support123! | Support | Customer service ops |
| billing1 | billing1@test.local | Billing123! | Billing | Invoice management |
| tech1 | tech1@test.local | Tech123! | Technical | Infrastructure ops |

---

## Essential Commands

### Docker & Services

```bash
# View all service logs
docker-compose -f docker-compose.full-stack.yml logs -f

# View specific service logs
docker-compose -f docker-compose.full-stack.yml logs -f api
docker-compose -f docker-compose.full-stack.yml logs -f authentik-server

# Restart a service
docker-compose -f docker-compose.full-stack.yml restart api
docker-compose -f docker-compose.full-stack.yml restart storefront

# Check service status
docker-compose -f docker-compose.full-stack.yml ps

# Stop all services
docker-compose -f docker-compose.full-stack.yml down

# Stop and remove volumes (DESTRUCTIVE)
docker-compose -f docker-compose.full-stack.yml down -v

# Rebuild and restart
docker-compose -f docker-compose.full-stack.yml up -d --build
```

### Testing

```bash
# Run unit tests - Storefront
cd D:\Projects\Pegasus\VaultScope
npm test

# Run unit tests - Admin
cd D:\Projects\Pegasus\VaultScope-Admin
npm test

# Run unit tests - API
cd D:\Projects\Pegasus\VaultScope-API
cargo test

# Run all tests in parallel (from VaultScope root)
npm test & cd ../VaultScope-Admin && npm test & cd ../VaultScope-API && cargo test

# Run specific test file
npx vitest run src/components/WaitlistForm.test.tsx
```

### Database Operations

```bash
# Connect to PostgreSQL
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope

# Execute SQL file
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -f /path/to/file.sql

# Database backup
docker exec vaultscope-postgres pg_dump -U postgres vaultscope > backup.sql

# Check migrations
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT version, description, success FROM _sqlx_migrations ORDER BY version;"

# View staff records
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT s.username, s.email, r.name as role FROM staff s JOIN roles r ON s.role_id = r.id;"

# Check database health
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT schemaname, tablename, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;"
```

### Authentik Configuration

```bash
# Run automated configuration (requires API token)
cd D:\Projects\Pegasus\VaultScope
python authentik-config/configure-with-token.py <your-token>

# Get user IDs for database records
bash authentik-config/get-user-ids.sh <your-token>

# Test OIDC endpoints
bash authentik-config/test-oidc.sh

# Check Authentik health
curl http://localhost:9000/-/health/ready/
curl http://localhost:9000/-/health/live/
```

### API Health Checks

```bash
# Check API health
curl http://localhost:8000/api/health

# Test OIDC discovery endpoints
curl -s http://localhost:9000/application/o/vaultscope-storefront/.well-known/openid-configuration | jq
curl -s http://localhost:9000/application/o/vaultscope-admin/.well-known/openid-configuration | jq

# Test authenticated endpoint (replace TOKEN)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/admin/users
```

---

## Critical Files & Directories

### QA Reports & Status

| File | Purpose | When to Read |
|------|---------|--------------|
| `FINAL_QA_REPORT.md` | Comprehensive QA results | Start here - main summary |
| `EXECUTIVE_DASHBOARD.md` | Visual status summary | Quick status check |
| `QA_STATUS.md` | Real-time progress tracking | Monitor ongoing work |
| `QUICK_REFERENCE.md` | Commands & endpoints | This file - daily reference |
| `ISSUE_TRACKER.md` | All tracked issues | Issue management |
| `HANDOFF.md` | Next steps for team | When picking up work |
| `CLEANUP.md` | Cleanup procedures | Before/after testing |
| `GETTING_STARTED.md` | New user guide | First-time setup |

### Test Results

| Directory | Contents |
|-----------|----------|
| `test-results/` | Unit test outputs (3 repos) |
| `docker-build-results/` | Docker build logs and fixed Dockerfiles |
| `database-verification/` | Schema, constraints, indexes, migrations reports |
| `infrastructure/` | Deployment configs, service endpoints |
| `authentik-config/` | OIDC setup tools (14 files) |

### Security & Database

| File | Purpose |
|------|---------|
| `database-verification/recommended-fixes.sql` | Ready-to-execute performance improvements |
| `database-verification/schema-report.json` | Complete database schema |
| `database-verification/indexes-report.json` | Index analysis + 15 missing FK indexes |
| `database-verification/integrity-issues.json` | Data integrity findings |

### Configuration

| File | Purpose | Important Notes |
|------|---------|-----------------|
| `docker-compose.full-stack.yml` | Complete stack definition | Contains client secrets |
| `init-databases.sql` | Database initialization | Creates vaultscope + authentik DBs |
| `.env.example` | Environment variable template | Copy to .env and customize |
| `infrastructure/secrets.env` | **DO NOT COMMIT** | Generated secrets |

### Authentik Setup

| File | Purpose | When to Use |
|------|---------|-------------|
| `authentik-config/RUN_ME_FIRST.txt` | **START HERE** | First-time setup |
| `authentik-config/QUICKSTART.md` | 15-minute automated setup | Recommended path |
| `authentik-config/SETUP_GUIDE.md` | Step-by-step manual guide | If automation fails |
| `authentik-config/authentik-config-summary.md` | Complete reference | Troubleshooting |
| `authentik-config/configure-with-token.py` | Automated configuration | Requires API token |
| `authentik-config/test-oidc.sh` | Verification script | After configuration |

---

## Common Tasks

### Starting Fresh

```bash
# 1. Stop everything
docker-compose -f docker-compose.full-stack.yml down -v

# 2. Rebuild images
docker-compose -f docker-compose.full-stack.yml build

# 3. Start stack
docker-compose -f docker-compose.full-stack.yml up -d

# 4. Watch logs
docker-compose -f docker-compose.full-stack.yml logs -f

# 5. Configure Authentik
# Follow authentik-config/QUICKSTART.md
```

### Debugging Authentication Issues

```bash
# 1. Check Authentik logs
docker-compose -f docker-compose.full-stack.yml logs authentik-server --tail 100

# 2. Check API logs
docker-compose -f docker-compose.full-stack.yml logs api --tail 100

# 3. Verify OIDC endpoints
bash authentik-config/test-oidc.sh

# 4. Check database staff records
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT * FROM staff;"

# 5. Verify JWT token claims (decode at jwt.io)
# Get token from browser dev tools or API response
```

### Performance Investigation

```bash
# 1. Check missing indexes
cat database-verification/indexes-report.json | jq '.missing_fk_indexes'

# 2. Apply performance fixes
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope \
  -f database-verification/recommended-fixes.sql

# 3. Analyze query performance
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "EXPLAIN ANALYZE SELECT * FROM services WHERE customer_id = 123;"

# 4. Check table statistics
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c \
  "SELECT * FROM pg_stat_user_tables WHERE schemaname = 'public';"
```

### Security Testing

```bash
# 1. Test rate limiting
for i in {1..150}; do curl -s http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer TOKEN" -w "%{http_code}\n" -o /dev/null; done

# 2. Test CSRF protection
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. Test cross-audience JWT (should fail)
# Get storefront token, try on admin endpoint
curl http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer STOREFRONT_TOKEN"

# 4. Test fake JWT (should fail)
curl http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer fake.jwt.token"
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill process by PID (Windows)
taskkill /PID <pid> /F

# Check Docker resources
docker system df
docker system prune  # Clean up if needed
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.full-stack.yml ps postgres

# Test connection
docker exec -it vaultscope-postgres psql -U postgres -c "SELECT 1;"

# Check database exists
docker exec -it vaultscope-postgres psql -U postgres -l

# Recreate database (DESTRUCTIVE)
docker exec -it vaultscope-postgres psql -U postgres -c "DROP DATABASE vaultscope;"
docker exec -it vaultscope-postgres psql -U postgres -c "CREATE DATABASE vaultscope;"
```

### Authentik Issues

```bash
# Reset Authentik admin password
docker exec -it vaultscope-authentik-server ak create_admin_group
docker exec -it vaultscope-authentik-server ak create_admin --username admin --password admin

# Clear Redis cache
docker exec -it vaultscope-redis redis-cli FLUSHALL

# Check Authentik database
docker exec -it vaultscope-postgres psql -U postgres -d authentik -c \
  "SELECT COUNT(*) FROM authentik_core_user;"
```

### Frontend Build Issues

```bash
# Clear cache and rebuild
cd D:\Projects\Pegasus\VaultScope
rm -rf node_modules dist
npm install
npm run build

# Check environment variables
cat .env

# Test in development mode
npm run dev
```

---

## Environment Variables

### API (.env in VaultScope-API)

```bash
DATABASE_URL=postgresql://postgres:postgres_dev@localhost:5432/vaultscope
REDIS_URL=redis://localhost:6379
AUTHENTIK_ISSUER=http://localhost:9000/application/o/vaultscope-admin/
AUTHENTIK_CLIENT_ID_ADMIN=vaultscope-admin
AUTHENTIK_CLIENT_SECRET_ADMIN=<from-authentik>
AUTHENTIK_CLIENT_ID_STOREFRONT=vaultscope-storefront
AUTHENTIK_CLIENT_SECRET_STOREFRONT=<from-authentik>
ENCRYPTION_KEY=<32-byte-base64-key>
JWT_SECRET=<random-secret>
```

### Frontend (.env in VaultScope)

```bash
VITE_API_URL=http://localhost:8000
VITE_ADMIN_URL=http://localhost:3001
VITE_AUTHENTIK_URL=http://localhost:9000
```

### Admin Frontend (.env in VaultScope-Admin)

```bash
VITE_API_URL=http://localhost:8000
VITE_AUTHENTIK_URL=http://localhost:9000
```

---

## Quick Status Check

```bash
# All-in-one status check script
# Create this as status-check.sh

#!/bin/bash
echo "=== Service Status ==="
docker-compose -f docker-compose.full-stack.yml ps

echo -e "\n=== API Health ==="
curl -s http://localhost:8000/api/health | jq

echo -e "\n=== Authentik Health ==="
curl -s http://localhost:9000/-/health/ready/ | jq

echo -e "\n=== Database Connection ==="
docker exec vaultscope-postgres psql -U postgres -c "SELECT 1;" 2>&1 | head -n 1

echo -e "\n=== Staff Count ==="
docker exec vaultscope-postgres psql -U postgres -d vaultscope -t -c \
  "SELECT COUNT(*) FROM staff;"

echo -e "\n=== Recent Logs (Last 5 lines each) ==="
echo "API:"
docker-compose -f docker-compose.full-stack.yml logs --tail=5 api 2>&1 | tail -n 5
echo "Authentik:"
docker-compose -f docker-compose.full-stack.yml logs --tail=5 authentik-server 2>&1 | tail -n 5
```

---

## Reference Links

### Documentation
- **FINAL_QA_REPORT.md** - Comprehensive QA results
- **WORKSTREAM_2B_REPORT.md** - Authentik setup details
- **qa-coordination-plan.md** - Complete 14-workstream plan

### External Resources
- Authentik Docs: https://docs.goauthentik.io/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Docker Compose: https://docs.docker.com/compose/

---

## Contact & Support

**For Questions:**
- See `HANDOFF.md` for team contacts
- Check `ISSUE_TRACKER.md` for known issues
- Review `FINAL_QA_REPORT.md` for detailed findings

**Emergency Procedures:**
- See `CLEANUP.md` for safe shutdown
- Database backup before major changes
- Keep `infrastructure/secrets.env` secure

---

**Last Updated:** 2026-09-12  
**QA Run ID:** a7c4f8b2-3d1e-4a6f-9c2b-8e5f7a3d1c9e  
**Version:** 1.0
