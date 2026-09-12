# VaultScope Local Stack - Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed
- Ports available: 3000, 3001, 5432, 8000, 9000, 9443

## Start the Stack

```bash
# From project root
docker-compose -f docker-compose.full-stack.yml up -d

# Wait for all services to start (~60-90 seconds)
docker-compose -f docker-compose.full-stack.yml logs -f
```

## Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.full-stack.yml ps

# Test endpoints
curl http://localhost:8000/api/health    # API: {"status":"ok"}
curl http://localhost:3000               # Storefront
curl http://localhost:3001               # Admin
curl http://localhost:9000               # Authentik
```

## Access Services

- **API**: http://localhost:8000
- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Authentik**: http://localhost:9000
  - Email: `admin@localhost`
  - Password: `admin`

## Database Access

```bash
# Connect to PostgreSQL
docker exec -it vaultscope-postgres psql -U postgres -d vaultscope

# View tables
\dt

# View data
SELECT * FROM staff LIMIT 10;
```

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.full-stack.yml logs -f [service]

# Restart service
docker-compose -f docker-compose.full-stack.yml restart [service]

# Stop all
docker-compose -f docker-compose.full-stack.yml down

# Stop and remove data
docker-compose -f docker-compose.full-stack.yml down -v
```

## Next Steps

1. Configure Authentik OIDC applications (see infrastructure/deployment-summary.md)
2. Update client secrets in docker-compose.full-stack.yml
3. Restart API: `docker-compose -f docker-compose.full-stack.yml restart api`
4. Begin E2E testing

## Troubleshooting

### Port already in use
```bash
# Stop conflicting services
docker ps  # Find container using the port
docker stop <container_name>
```

### Service not responding
```bash
# Check logs
docker-compose -f docker-compose.full-stack.yml logs [service]

# Restart service
docker-compose -f docker-compose.full-stack.yml restart [service]
```

### Database connection issues
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.full-stack.yml logs postgres

# Verify databases exist
docker exec vaultscope-postgres psql -U postgres -c "\l"
```

## More Information

- Full deployment details: `infrastructure/deployment-summary.md`
- Service endpoints: `infrastructure/service-endpoints.txt`
- Secrets management: `infrastructure/secrets.env` (DO NOT COMMIT)
