# VaultScope QA Cleanup Procedures

**Purpose:** Safe procedures for stopping services, cleaning up test artifacts, and preparing for restart or handoff.

---

## Table of Contents

1. [Quick Cleanup](#quick-cleanup)
2. [Full Cleanup](#full-cleanup)
3. [Partial Cleanup](#partial-cleanup)
4. [What to Keep vs Delete](#what-to-keep-vs-delete)
5. [Restart from Checkpoint](#restart-from-checkpoint)
6. [Troubleshooting](#troubleshooting)

---

## Quick Cleanup

**Use case:** Stop services for short break, keep all data and containers.

### Steps

```bash
# Navigate to project directory
cd D:\Projects\Pegasus\VaultScope

# Stop all services (containers remain, data preserved)
docker-compose -f docker-compose.full-stack.yml stop

# Verify all stopped
docker-compose -f docker-compose.full-stack.yml ps
```

### To Resume

```bash
# Start all services
docker-compose -f docker-compose.full-stack.yml start

# View logs
docker-compose -f docker-compose.full-stack.yml logs -f
```

**Time:** 30 seconds  
**Data Loss:** None  
**Disk Space Freed:** 0 MB

---

## Full Cleanup

**Use case:** Complete teardown, remove all containers and volumes, fresh start.

### ⚠️ WARNING
**This deletes all data including:**
- All database records (customers, services, invoices, etc.)
- All Authentik users and configuration
- All test results stored in volumes
- All Docker volumes

**Artifacts in the filesystem are NOT deleted** (test-results/, reports, etc.)

### Steps

```bash
# 1. Stop and remove all containers and volumes
cd D:\Projects\Pegasus\VaultScope
docker-compose -f docker-compose.full-stack.yml down -v

# 2. Verify containers removed
docker ps -a | grep vaultscope

# 3. Verify volumes removed
docker volume ls | grep vaultscope

# 4. (Optional) Remove Docker images to free more space
docker rmi vaultscope-storefront:test
docker rmi vaultscope-admin:test
docker rmi vaultscope-api:test

# 5. (Optional) Remove all unused Docker resources
docker system prune -a --volumes
```

### Confirmation Checklist

After full cleanup:
- [ ] No vaultscope containers in `docker ps -a`
- [ ] No vaultscope volumes in `docker volume ls`
- [ ] No processes listening on ports 3000, 3001, 8000, 9000, 5432, 6379
- [ ] PostgreSQL data directory removed (if using local path)

**Time:** 2-3 minutes  
**Data Loss:** ALL container and volume data  
**Disk Space Freed:** ~2-3 GB

---

## Partial Cleanup

**Use case:** Remove containers but keep volumes (database data, Redis cache).

### Steps

```bash
# Stop and remove containers only (keep volumes)
docker-compose -f docker-compose.full-stack.yml down

# Verify containers removed but volumes remain
docker volume ls | grep vaultscope
# Should show:
# - vaultscope_postgres_data
# - vaultscope_authentik_postgres
# - vaultscope_redis_data
```

### To Resume

```bash
# Restart with existing volumes
docker-compose -f docker-compose.full-stack.yml up -d

# Authentik users and database data will be preserved
```

**Time:** 1 minute  
**Data Loss:** None (containers only)  
**Disk Space Freed:** ~500 MB (stopped containers)

---

## What to Keep vs Delete

### Always Keep (Version Control)

These should be committed to Git:

```
✅ KEEP (commit to Git):
├── FINAL_QA_REPORT.md
├── EXECUTIVE_DASHBOARD.md
├── QUICK_REFERENCE.md
├── ISSUE_TRACKER.md
├── HANDOFF.md
├── CLEANUP.md
├── GETTING_STARTED.md
├── TEST_METRICS.json
├── QA_STATUS.md
├── qa-coordination-plan.md
├── WORKSTREAM_2B_REPORT.md
├── docker-compose.full-stack.yml
├── init-databases.sql
├── test-results/
│   ├── storefront-unit.json
│   ├── admin-unit.json
│   └── api-unit.json
├── docker-build-results/
│   ├── build-log.txt
│   ├── Dockerfile.storefront.fixed
│   ├── Dockerfile.admin.fixed
│   └── image-sizes.txt
├── database-verification/
│   ├── schema-report.json
│   ├── constraints-report.json
│   ├── indexes-report.json
│   ├── migrations-report.json
│   ├── integrity-issues.json
│   └── recommended-fixes.sql
└── authentik-config/
    ├── *.md (all documentation)
    ├── *.py (scripts)
    ├── *.sh (scripts)
    ├── *.sql (templates)
    └── groups.json
```

### Never Commit (Security Risk)

These contain secrets and should be in .gitignore:

```
❌ NEVER COMMIT:
├── .env
├── infrastructure/
│   └── secrets.env
└── authentik-config/
    ├── users.json (contains test passwords)
    └── oidc-providers.json (contains client secrets)
```

### Safe to Delete (Regenerable)

These can be recreated and don't need version control:

```
🗑️ SAFE TO DELETE:
├── node_modules/ (all repos)
├── dist/ (frontend builds)
├── target/ (Rust builds)
├── docker-images/*.tar (exportable images)
├── cleanup/
│   ├── database-dump.sql
│   └── container-logs.tar.gz
└── Docker volumes (if backed up)
```

---

## Cleanup Procedures by Scenario

### Scenario 1: End of Day

**Goal:** Stop services, free resources, easy to resume tomorrow.

```bash
# Stop services
docker-compose -f docker-compose.full-stack.yml stop

# Commit any new findings
cd D:\Projects\Pegasus\VaultScope
git add FINAL_QA_REPORT.md QA_STATUS.md
git commit -m "feat(qa): daily progress checkpoint"
```

### Scenario 2: End of QA Run

**Goal:** Archive results, clean up completely.

```bash
# 1. Export final database state (if needed)
docker exec vaultscope-postgres pg_dump -U postgres vaultscope > final-db-state.sql

# 2. Archive logs
mkdir -p cleanup
docker-compose -f docker-compose.full-stack.yml logs > cleanup/all-services.log

# 3. Stop and remove everything
docker-compose -f docker-compose.full-stack.yml down -v

# 4. Commit all reports
git add *.md *.json test-results/ database-verification/
git commit -m "feat(qa): complete QA run results"

# 5. Clean up local artifacts if desired
rm -rf node_modules/  # Safe to delete, can reinstall
rm -rf target/        # Safe to delete, can rebuild
```

### Scenario 3: Preparing for Production

**Goal:** Clean test data, keep only production-ready artifacts.

```bash
# 1. Remove all test users from Authentik (if production Authentik)
# Do this via Authentik UI: Directory → Users → Delete test users

# 2. Clear test data from database
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope -c "
DELETE FROM customers WHERE email LIKE '%@test.local';
DELETE FROM staff WHERE email LIKE '%@test.local';
DELETE FROM tickets WHERE customer_id IN (SELECT id FROM customers WHERE email LIKE '%@test.local');
"

# 3. Apply production-ready fixes
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope \
  -f database-verification/recommended-fixes.sql

# 4. Clean up QA-specific files
rm -rf test-results/
rm -rf docker-build-results/
rm -rf cleanup/

# 5. Keep only production documentation
# Keep: GETTING_STARTED.md, database-verification/recommended-fixes.sql
# Archive: FINAL_QA_REPORT.md, ISSUE_TRACKER.md, etc.
```

### Scenario 4: Switching to Different Environment

**Goal:** Clean up local, prepare for staging/production deployment.

```bash
# 1. Stop local stack
docker-compose -f docker-compose.full-stack.yml down

# 2. Don't delete volumes (backup option)
docker volume ls  # Note volume names

# 3. Export environment-specific configs
cp .env .env.local.backup
cp infrastructure/secrets.env infrastructure/secrets.local.backup

# 4. Clean environment files
rm .env infrastructure/secrets.env

# 5. Document what needs to be configured in new environment
# See GETTING_STARTED.md for deployment checklist
```

---

## Restart from Checkpoint

### From Clean State

```bash
# 1. Clone repository (if new machine)
git clone <repo-url>
cd VaultScope

# 2. Install dependencies
npm install
cd ../VaultScope-Admin && npm install
cd ../VaultScope-API && cargo build

# 3. Copy environment template
cp .env.example .env
# Edit .env with your values

# 4. Start infrastructure
docker-compose -f docker-compose.full-stack.yml up -d

# 5. Configure Authentik
# Follow authentik-config/QUICKSTART.md

# 6. Run tests
npm test
```

### From Stopped State (Data Preserved)

```bash
# 1. Start services
docker-compose -f docker-compose.full-stack.yml start

# 2. Verify health
docker-compose -f docker-compose.full-stack.yml ps
curl http://localhost:8000/api/health

# 3. Resume testing
npm test
```

### From After Authentik Configuration

```bash
# 1. Verify Authentik configured
bash authentik-config/test-oidc.sh

# 2. Resume at Workstream 3A (E2E testing)
# See HANDOFF.md for next steps
```

---

## File System Cleanup

### What's Safe to Delete

```bash
# Frontend build artifacts (can rebuild)
rm -rf VaultScope/dist
rm -rf VaultScope/node_modules
rm -rf VaultScope-Admin/dist
rm -rf VaultScope-Admin/node_modules

# Rust build artifacts (can rebuild)
rm -rf VaultScope-API/target

# Docker artifacts (can rebuild)
rm -rf docker-images/*.tar

# Temporary test files
rm -rf cleanup/
```

### What to Archive

```bash
# Create archive of QA artifacts
mkdir -p qa-archive-2026-09-12
cp -r test-results/ qa-archive-2026-09-12/
cp -r database-verification/ qa-archive-2026-09-12/
cp FINAL_QA_REPORT.md qa-archive-2026-09-12/
cp EXECUTIVE_DASHBOARD.md qa-archive-2026-09-12/
tar -czf qa-results-2026-09-12.tar.gz qa-archive-2026-09-12/

# Upload to storage or version control
```

---

## Port Cleanup

If services won't start due to port conflicts:

### Check What's Using Ports

```bash
# Windows
netstat -ano | findstr :5432
netstat -ano | findstr :6379
netstat -ano | findstr :8000
netstat -ano | findstr :9000
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :5432
lsof -i :6379
lsof -i :8000
lsof -i :9000
lsof -i :3000
lsof -i :3001
```

### Kill Processes

```bash
# Windows
taskkill /PID <pid> /F

# Linux/Mac
kill -9 <pid>
```

### Change Ports (Alternative)

Edit `docker-compose.full-stack.yml`:

```yaml
# Example: Change PostgreSQL from 5432 to 5433
postgres:
  ports:
    - "5433:5432"  # host:container
```

---

## Docker Cleanup Commands

### Remove Stopped Containers

```bash
docker container prune
```

### Remove Unused Volumes

```bash
docker volume prune
```

### Remove Unused Images

```bash
docker image prune -a
```

### Remove Everything (Nuclear Option)

```bash
# ⚠️ WARNING: Removes ALL Docker resources
docker system prune -a --volumes

# This will delete:
# - All stopped containers
# - All networks not used by at least one container
# - All images without at least one container
# - All build cache
# - All volumes not used by at least one container
```

---

## Troubleshooting Cleanup

### Containers Won't Stop

```bash
# Force stop
docker-compose -f docker-compose.full-stack.yml kill

# Force remove
docker-compose -f docker-compose.full-stack.yml rm -f
```

### Volumes Won't Delete

```bash
# Check what's using volume
docker ps -a --filter volume=vaultscope_postgres_data

# Remove container first
docker rm -f <container-id>

# Then remove volume
docker volume rm vaultscope_postgres_data
```

### Permission Errors

```bash
# Windows: Run PowerShell as Administrator
# Linux/Mac: Use sudo

sudo docker-compose -f docker-compose.full-stack.yml down -v
```

### Disk Space Issues

```bash
# Check Docker disk usage
docker system df

# Clean up build cache (can free significant space)
docker builder prune -a

# Remove dangling images
docker image prune
```

---

## Post-Cleanup Verification

After cleanup, verify clean state:

### Checklist

- [ ] No vaultscope containers running: `docker ps | grep vaultscope` returns nothing
- [ ] Ports freed: `netstat -ano | findstr :<port>` shows no processes
- [ ] Volumes removed (if full cleanup): `docker volume ls | grep vaultscope` returns nothing
- [ ] Disk space reclaimed: `docker system df` shows reduced usage
- [ ] Git status clean: `git status` shows only intended changes
- [ ] No secrets committed: Check .gitignore is working

### Quick Verification Script

```bash
#!/bin/bash
# cleanup-verify.sh

echo "=== Container Check ==="
CONTAINERS=$(docker ps -a | grep vaultscope | wc -l)
if [ $CONTAINERS -eq 0 ]; then
    echo "✅ No vaultscope containers"
else
    echo "❌ Found $CONTAINERS vaultscope containers"
fi

echo -e "\n=== Volume Check ==="
VOLUMES=$(docker volume ls | grep vaultscope | wc -l)
if [ $VOLUMES -eq 0 ]; then
    echo "✅ No vaultscope volumes"
else
    echo "⚠️  Found $VOLUMES vaultscope volumes (OK if partial cleanup)"
fi

echo -e "\n=== Port Check ==="
for PORT in 5432 6379 8000 9000 3000 3001; do
    USED=$(lsof -i :$PORT 2>/dev/null | wc -l)
    if [ $USED -eq 0 ]; then
        echo "✅ Port $PORT free"
    else
        echo "❌ Port $PORT in use"
    fi
done

echo -e "\n=== Git Check ==="
SECRETS=$(git status | grep -E 'secrets.env|users.json|oidc-providers.json' | wc -l)
if [ $SECRETS -eq 0 ]; then
    echo "✅ No secrets staged for commit"
else
    echo "❌ Secrets found in git staging!"
fi
```

---

## Emergency Procedures

### System Unresponsive

```bash
# 1. Force stop Docker
# Windows: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# 2. Kill all vaultscope processes
pkill -f vaultscope

# 3. Clean Docker state
docker system prune -a --volumes --force

# 4. Reboot if necessary
```

### Data Recovery

```bash
# If volumes deleted but backup exists
docker volume create vaultscope_postgres_data
docker run --rm -v vaultscope_postgres_data:/restore \
  -v $(pwd):/backup postgres:16 \
  bash -c "cd /restore && tar xvf /backup/postgres-backup.tar"
```

---

## Best Practices

### Before Cleanup

1. **Commit all reports** to Git
2. **Export database** if state is important
3. **Archive logs** for troubleshooting
4. **Document any manual changes** made

### During Cleanup

1. **Use `stop` before `down`** for safety
2. **Verify volumes** before using `-v` flag
3. **Check for running processes** on ports
4. **Don't force unless necessary**

### After Cleanup

1. **Verify clean state** with checklist above
2. **Test restart procedure** if planning to resume
3. **Update documentation** if process changed
4. **Archive artifacts** before deleting

---

## Related Documents

- **QUICK_REFERENCE.md** - Commands for daily use
- **GETTING_STARTED.md** - Setup from scratch
- **HANDOFF.md** - Resume QA from checkpoint
- **docker-compose.full-stack.yml** - Service definitions

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-12  
**QA Run:** a7c4f8b2-3d1e-4a6f-9c2b-8e5f7a3d1c9e
