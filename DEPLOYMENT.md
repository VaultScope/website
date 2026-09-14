# VaultScope Production Deployment Guide

**Version**: 1.0.0  
**Last Updated**: 2026-09-14  
**Audience**: DevOps, Platform Engineers

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Configuration](#configuration)
4. [Building Images](#building-images)
5. [Deployment](#deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services

1. **PostgreSQL 16+** (Managed Service)
   - AWS RDS, Azure Database for PostgreSQL, or equivalent
   - SSL enabled and enforced
   - Automated backups configured (7-day retention minimum)
   - Connection string format: `postgres://user:pass@host:5432/dbname`

2. **Redis 7+** (Managed Service)
   - AWS ElastiCache, Azure Cache for Redis, or equivalent
   - Persistence: RDB + AOF enabled
   - Memory: 512MB minimum
   - Connection string format: `redis://host:6379`

3. **Authentik** (OIDC Provider)
   - Self-hosted or managed instance
   - HTTPS enabled
   - Admin access for configuration

4. **Container Registry**
   - GitHub Container Registry (ghcr.io)
   - AWS ECR, Azure ACR, or Docker Hub
   - Push access configured

5. **SSL Certificates**
   - Valid certificates for all domains
   - Let's Encrypt recommended
   - Wildcard certificate optional

### Required Tools

```bash
# Docker Engine 24+
docker --version

# Docker Compose v2
docker compose version

# Git
git --version

# OpenSSL (for generating secrets)
openssl version
```

---

## Infrastructure Setup

### 1. Database Initialization

```bash
# Connect to PostgreSQL
psql ${DATABASE_URL}

# Run migrations (automated via API on startup)
# Verify database schema
\dt

# Create indexes (if not automated)
\i database-verification/recommended-fixes.sql

# Verify indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND indexname LIKE 'idx_%';
```

### 2. Redis Configuration

```bash
# Connect to Redis
redis-cli -u ${REDIS_URL}

# Verify connectivity
PING

# Check persistence config
CONFIG GET save
CONFIG GET appendonly

# Should return:
# save "60 1"
# appendonly "yes"
```

### 3. Authentik Configuration

#### Create OAuth2 Providers

**Admin Provider:**
```
Name: VaultScope Admin
Client ID: vaultscope-admin
Client Type: Confidential
Redirect URIs: 
  - https://admin.yourdomain.com/auth/callback
Scopes: openid, profile, email
```

**Storefront Provider:**
```
Name: VaultScope Storefront
Client ID: vaultscope-storefront
Client Type: Confidential
Redirect URIs:
  - https://app.yourdomain.com/auth/callback
Scopes: openid, profile, email
```

**Save Client Secrets** - Store in secrets manager

---

## Configuration

### 1. Generate Secrets

```bash
# JWT Secret (64-byte base64)
openssl rand -base64 64

# Encryption Key (64-character hex)
openssl rand -hex 32
```

### 2. Configure Environment

Copy `.env.production.example` to `.env.production`:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with actual values:

```bash
# Required: Fill in all values
nano .env.production
```

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Generated JWT secret
- `ENCRYPTION_KEY` - Generated encryption key
- `AUTHENTIK_CLIENT_SECRET_ADMIN` - From Authentik
- `AUTHENTIK_CLIENT_SECRET_STOREFRONT` - From Authentik

### 3. Secrets Management

**Recommended: Use Cloud Secrets Manager**

AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
    --name vaultscope/production/jwt \
    --secret-string "$(openssl rand -base64 64)"
```

Azure Key Vault:
```bash
az keyvault secret set \
    --vault-name vaultscope-vault \
    --name jwt-secret \
    --value "$(openssl rand -base64 64)"
```

---

## Building Images

### Option 1: Production Build Script

```bash
# Set version (uses git tag if available)
export VERSION=1.0.0

# Build all images
./scripts/build-prod.sh

# Push to registry
docker push ghcr.io/yourorg/vaultscope-api:1.0.0
docker push ghcr.io/yourorg/vaultscope-storefront:1.0.0
docker push ghcr.io/yourorg/vaultscope-admin:1.0.0
```

### Option 2: Manual Build

```bash
# Load environment
source .env.production

# Build API
cd VaultScope-API
docker build -t ${REGISTRY}/vaultscope-api:${VERSION} .
docker push ${REGISTRY}/vaultscope-api:${VERSION}

# Build Storefront
cd ../VaultScope
docker build \
    --build-arg VITE_API_URL=${VITE_API_URL} \
    --build-arg VITE_AUTHENTIK_URL=${VITE_AUTHENTIK_URL} \
    --build-arg VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID_STOREFRONT} \
    --build-arg VITE_OIDC_REDIRECT_URI=${VITE_OIDC_REDIRECT_URI_STOREFRONT} \
    -t ${REGISTRY}/vaultscope-storefront:${VERSION} .
docker push ${REGISTRY}/vaultscope-storefront:${VERSION}

# Build Admin
cd ../VaultScope-Admin
docker build \
    --build-arg VITE_API_URL=${VITE_API_URL} \
    --build-arg VITE_AUTHENTIK_URL=${VITE_AUTHENTIK_URL} \
    --build-arg VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID_ADMIN} \
    --build-arg VITE_OIDC_REDIRECT_URI=${VITE_OIDC_REDIRECT_URI_ADMIN} \
    -t ${REGISTRY}/vaultscope-admin:${VERSION} .
docker push ${REGISTRY}/vaultscope-admin:${VERSION}
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets stored in secrets manager
- [ ] SSL certificates valid and installed
- [ ] DNS records configured
- [ ] Backup strategy verified
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

### 1. Initial Deployment

```bash
# Load production environment
source .env.production

# Pull images
docker compose -f docker-compose.prod.yml pull

# Start services
docker compose -f docker-compose.prod.yml up -d

# Watch logs
docker compose -f docker-compose.prod.yml logs -f
```

### 2. Verify Health Checks

```bash
# Check service health
docker compose -f docker-compose.prod.yml ps

# All services should show "healthy"

# Manual health check
curl https://api.yourdomain.com/api/health
# Should return: {"status":"ok"}
```

### 3. Database Migrations

Migrations run automatically on API startup. Verify:

```bash
# Check API logs
docker compose -f docker-compose.prod.yml logs api | grep migration

# Should see: "database connected and migrations applied"
```

### 4. Configure Reverse Proxy

**Nginx Example:**

```nginx
# /etc/nginx/sites-available/vaultscope

# API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Storefront
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Admin
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.com app.yourdomain.com admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# API
curl https://api.yourdomain.com/api/health

# Storefront
curl -I https://app.yourdomain.com

# Admin
curl -I https://admin.yourdomain.com
```

### 2. Authentication Flow

```bash
# Test admin login
# 1. Navigate to https://admin.yourdomain.com
# 2. Click "Login with Authentik"
# 3. Verify redirect to Authentik
# 4. Login with test credentials
# 5. Verify redirect back to admin dashboard

# Test storefront login (same process)
```

### 3. Database Connectivity

```bash
# Check API can connect to database
docker compose -f docker-compose.prod.yml logs api | grep "database connected"
```

### 4. Redis Connectivity

```bash
# Check API can connect to Redis
docker compose -f docker-compose.prod.yml logs api | grep "redis connected"

# Test OIDC state storage
# Login should generate state in Redis:
docker exec -it redis-container redis-cli KEYS "oidc:state:*"
```

---

## Rollback Procedures

### Option 1: Rollback to Previous Version

```bash
# Stop current deployment
docker compose -f docker-compose.prod.yml down

# Set previous version
export VERSION=0.9.9

# Restart with previous version
docker compose -f docker-compose.prod.yml up -d
```

### Option 2: Emergency Rollback

```bash
# Immediate stop
docker compose -f docker-compose.prod.yml down

# Restore from backup (if needed)
pg_restore -h prod-db.yourdomain.com -U postgres -d vaultscope backup.sql

# Start previous known-good version
# (keep multiple versions in registry)
```

### Database Rollback

```bash
# Connect to database
psql ${DATABASE_URL}

# Check migration history
SELECT * FROM _sqlx_migrations ORDER BY installed_on DESC LIMIT 5;

# Manual rollback (if needed)
# Contact database administrator
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs api

# Common issues:
# 1. Database connection failure
#    - Verify DATABASE_URL
#    - Check database is accessible
#    - Verify SSL requirements

# 2. Redis connection failure
#    - Verify REDIS_URL
#    - Check Redis is accessible

# 3. Missing environment variables
#    - Check .env.production
#    - Verify all required vars set
```

### Health Check Failing

```bash
# Check service is running
docker compose -f docker-compose.prod.yml ps api

# Test health endpoint directly
curl http://localhost:8000/api/health

# If fails, check:
# 1. Port binding correct
# 2. Health endpoint accessible
# 3. No firewall blocking
```

### Authentication Not Working

```bash
# Verify Authentik configuration
# 1. Client IDs match
# 2. Client secrets correct
# 3. Redirect URIs match exactly
# 4. Providers enabled

# Check API logs for auth errors
docker compose -f docker-compose.prod.yml logs api | grep -i auth

# Test state generation
curl -X POST https://api.yourdomain.com/api/auth/init-login
# Should return: {"state":"..."}
```

### Database Migration Failures

```bash
# Check migration status
psql ${DATABASE_URL} -c "SELECT * FROM _sqlx_migrations;"

# Re-run migrations manually (if needed)
# Inside API container:
docker compose -f docker-compose.prod.yml exec api /bin/sh
# Then run migrations (handled by sqlx automatically)

# Emergency: Restore from backup
pg_restore -h host -U user -d vaultscope backup.sql
```

---

## Support

**Internal Documentation**: See RUNBOOK.md for operations procedures

**Logs**: 
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100
```

**Monitoring**: Check Grafana dashboards (if configured)

**Alerts**: Check PagerDuty/OpsGenie for active incidents

---

## Security Notes

1. **Never commit .env.production to version control**
2. **Rotate secrets every 90 days minimum**
3. **Use secrets manager for production secrets**
4. **Enable SSL/TLS for all connections**
5. **Implement rate limiting at load balancer**
6. **Monitor failed authentication attempts**
7. **Regular security audits recommended**

---

**Last Review**: 2026-09-14  
**Next Review**: 2026-12-14  
**Contact**: Platform Team
