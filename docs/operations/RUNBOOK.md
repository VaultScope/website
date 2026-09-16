# VaultScope Operations Runbook

**Version**: 1.0.0  
**Last Updated**: 2026-09-14  
**Audience**: On-Call Engineers, SREs

---

## Quick Reference

### Service URLs
- API: `https://api.yourdomain.com`
- Storefront: `https://app.yourdomain.com`
- Admin: `https://admin.yourdomain.com`
- Authentik: `https://auth.yourdomain.com`

### Health Endpoints
```bash
curl https://api.yourdomain.com/api/health
```

### Logs
```bash
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f storefront
docker compose -f docker-compose.prod.yml logs -f admin
```

---

## Common Operations

### Restart Services

```bash
# Restart all services
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart api

# Force recreate (pull latest image)
docker compose -f docker-compose.prod.yml up -d --force-recreate api
```

### Scale Services

```bash
# Scale API horizontally
docker compose -f docker-compose.prod.yml up -d --scale api=3

# Note: Requires load balancer configuration
```

### View Service Status

```bash
# Check all services
docker compose -f docker-compose.prod.yml ps

# Check specific service
docker stats vaultscope-api

# Check health status
docker inspect --format='{{.State.Health.Status}}' vaultscope-api
```

---

## Backup & Restore

### Database Backup

```bash
# Create backup
pg_dump ${DATABASE_URL} > backup-$(date +%Y%m%d-%H%M%S).sql

# Compressed backup
pg_dump ${DATABASE_URL} | gzip > backup-$(date +%Y%m%d).sql.gz

# Automated backup (add to cron)
0 2 * * * pg_dump ${DATABASE_URL} | gzip > /backups/vaultscope-$(date +\%Y\%m\%d).sql.gz
```

### Database Restore

```bash
# Stop API to prevent writes
docker compose -f docker-compose.prod.yml stop api

# Restore from backup
gunzip -c backup-20260914.sql.gz | psql ${DATABASE_URL}

# Restart API
docker compose -f docker-compose.prod.yml start api

# Verify
curl https://api.yourdomain.com/api/health
```

### Redis Backup

```bash
# Trigger RDB snapshot
redis-cli -u ${REDIS_URL} BGSAVE

# Check if snapshot completed
redis-cli -u ${REDIS_URL} LASTSAVE

# Copy RDB file (from Redis host)
cp /var/lib/redis/dump.rdb /backups/redis-$(date +%Y%m%d).rdb
```

---

## Performance Tuning

### Check Database Performance

```bash
# Connect to database
psql ${DATABASE_URL}

# Slow query analysis
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

# Index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
ORDER BY pg_relation_size(indexrelid) DESC;

# Table sizes
SELECT 
    schemaname || '.' || tablename AS table,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Redis Memory

```bash
# Memory info
redis-cli -u ${REDIS_URL} INFO memory

# Key statistics
redis-cli -u ${REDIS_URL} INFO keyspace

# Check OIDC states
redis-cli -u ${REDIS_URL} KEYS "oidc:state:*" | wc -l
```

### Container Resource Usage

```bash
# Real-time stats
docker stats

# Historical usage (if monitoring enabled)
# Check Grafana dashboards
```

---

## Security Operations

### Rotate Secrets

```bash
# 1. Generate new secrets
NEW_JWT=$(openssl rand -base64 64)
NEW_ENC=$(openssl rand -hex 32)

# 2. Update secrets manager
aws secretsmanager update-secret \
    --secret-id vaultscope/production/jwt \
    --secret-string "${NEW_JWT}"

# 3. Update .env.production
nano .env.production

# 4. Restart services
docker compose -f docker-compose.prod.yml restart
```

### Check Failed Logins

```bash
# API logs for auth failures
docker compose -f docker-compose.prod.yml logs api \
    | grep -i "unauthorized\|forbidden\|failed"

# Count by IP (if reverse proxy logs available)
tail -n 10000 /var/log/nginx/access.log \
    | grep "401\|403" \
    | awk '{print $1}' \
    | sort | uniq -c | sort -rn | head -10
```

### Block Malicious IPs

```bash
# Nginx (temporary block)
# Add to /etc/nginx/conf.d/blocked.conf
deny 1.2.3.4;

# Reload nginx
nginx -s reload

# Permanent block (firewall)
ufw deny from 1.2.3.4
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

**API**:
- Response time (p50, p95, p99)
- Error rate (5xx responses)
- Request rate (req/s)
- Database connection pool utilization
- Redis connection pool utilization

**Database**:
- Connection count
- Query latency
- Lock waits
- Disk usage

**Redis**:
- Memory usage
- Evicted keys
- Connection count
- Hit rate

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| API Response Time (p95) | > 500ms | > 1000ms |
| API Error Rate | > 1% | > 5% |
| Database Connections | > 80% | > 95% |
| Redis Memory | > 80% | > 95% |
| Disk Usage | > 80% | > 90% |

### Check Prometheus Metrics

```bash
# API metrics endpoint (if enabled)
curl http://localhost:8000/metrics

# Common queries:
# - rate(http_requests_total[5m])
# - histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## Incident Response

### High Load / Performance Degradation

1. **Identify bottleneck**
   ```bash
   # Check resource usage
   docker stats
   
   # Check database
   psql ${DATABASE_URL} -c "SELECT * FROM pg_stat_activity;"
   
   # Check slow queries
   # See "Performance Tuning" section above
   ```

2. **Scale if needed**
   ```bash
   # Scale API horizontally
   docker compose -f docker-compose.prod.yml up -d --scale api=3
   ```

3. **Enable caching** (if not already)
   - Check Redis hit rate
   - Implement query result caching

4. **Notify stakeholders** if user-facing

### Service Down

1. **Check service health**
   ```bash
   docker compose -f docker-compose.prod.yml ps
   docker compose -f docker-compose.prod.yml logs --tail=100 api
   ```

2. **Attempt restart**
   ```bash
   docker compose -f docker-compose.prod.yml restart api
   ```

3. **If restart fails**
   - Check logs for errors
   - Verify external dependencies (database, Redis)
   - Check disk space: `df -h`
   - Check memory: `free -h`

4. **Escalate** if unresolved after 15 minutes

### Database Connection Pool Exhausted

```bash
# Check active connections
psql ${DATABASE_URL} -c "SELECT count(*) FROM pg_stat_activity;"

# Check by application
psql ${DATABASE_URL} -c "
SELECT 
    application_name, 
    count(*) 
FROM pg_stat_activity 
GROUP BY application_name;
"

# Kill idle connections (if needed)
psql ${DATABASE_URL} -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND query_start < NOW() - INTERVAL '5 minutes';
"

# Increase pool size (temporary)
# Update DB_MAX_CONNECTIONS in .env.production
# Restart API
```

### Redis Out of Memory

```bash
# Check memory usage
redis-cli -u ${REDIS_URL} INFO memory

# Check keys
redis-cli -u ${REDIS_URL} DBSIZE

# Find large keys
redis-cli -u ${REDIS_URL} --bigkeys

# Emergency: Flush expired keys
redis-cli -u ${REDIS_URL} BGREWRITEAOF

# If OIDC states accumulating (should auto-expire)
# Check TTL on states
redis-cli -u ${REDIS_URL} TTL "oidc:state:..."

# Manual cleanup (last resort)
redis-cli -u ${REDIS_URL} KEYS "oidc:state:*" | xargs redis-cli -u ${REDIS_URL} DEL
```

### Authentication Issues

1. **Verify Authentik is accessible**
   ```bash
   curl -I https://auth.yourdomain.com
   ```

2. **Check API can reach Authentik**
   ```bash
   docker compose -f docker-compose.prod.yml exec api curl -I ${AUTHENTIK_ISSUER}
   ```

3. **Verify state generation**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/init-login
   # Should return: {"state":"..."}
   ```

4. **Check Redis for states**
   ```bash
   redis-cli -u ${REDIS_URL} KEYS "oidc:state:*"
   ```

5. **Verify client secrets match**
   - Check .env.production
   - Verify in Authentik admin panel
   - Secrets must match exactly

---

## Maintenance Windows

### Planned Maintenance Procedure

1. **Schedule maintenance window**
   - Notify users 48 hours in advance
   - Choose low-traffic period (typically 2-4 AM)

2. **Pre-maintenance**
   ```bash
   # Create backup
   pg_dump ${DATABASE_URL} | gzip > backup-pre-maintenance.sql.gz
   
   # Tag current version
   docker compose -f docker-compose.prod.yml images
   ```

3. **During maintenance**
   ```bash
   # Stop services
   docker compose -f docker-compose.prod.yml down
   
   # Perform updates
   # - Database migrations
   # - Configuration changes
   # - Infrastructure updates
   
   # Start services
   docker compose -f docker-compose.prod.yml up -d
   ```

4. **Post-maintenance**
   ```bash
   # Verify health
   curl https://api.yourdomain.com/api/health
   
   # Smoke test authentication
   # Test critical user flows
   
   # Monitor logs for 30 minutes
   docker compose -f docker-compose.prod.yml logs -f
   ```

5. **Rollback if issues**
   - See DEPLOYMENT.md "Rollback Procedures"

---

## Log Management

### Log Locations

```bash
# Docker container logs
/var/lib/docker/containers/*/

# Via docker compose
docker compose -f docker-compose.prod.yml logs

# Nginx access logs (if used)
/var/log/nginx/access.log

# Nginx error logs
/var/log/nginx/error.log
```

### Log Rotation

Configured in docker-compose.prod.yml:
- Max size: 10MB per file
- Max files: 3
- Total: 30MB per service

### Search Logs

```bash
# Search for errors
docker compose -f docker-compose.prod.yml logs | grep -i error

# Search by time range
docker compose -f docker-compose.prod.yml logs --since "2026-09-14T10:00:00"

# Search specific service
docker compose -f docker-compose.prod.yml logs api | grep "customer"

# Follow logs in real-time
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

### Export Logs

```bash
# Export to file
docker compose -f docker-compose.prod.yml logs --since "24h" > logs-$(date +%Y%m%d).txt

# Send to log aggregation (if configured)
# - Elasticsearch/Kibana
# - Grafana Loki
# - CloudWatch Logs
# - Azure Monitor
```

---

## On-Call Checklist

### When Paged

- [ ] Check alert details
- [ ] Verify issue in monitoring dashboard
- [ ] Check service health: `docker compose ps`
- [ ] Review recent logs: `docker compose logs --tail=100`
- [ ] Check recent deployments
- [ ] Assess impact (how many users affected?)
- [ ] Begin mitigation

### Communication

- Update incident channel (Slack/Teams)
- Post status updates every 15 minutes
- Notify stakeholders if user-facing
- Document actions taken
- Create postmortem after resolution

### After Resolution

- [ ] Verify all services healthy
- [ ] Check monitoring dashboards
- [ ] Update incident log
- [ ] Schedule postmortem (within 48 hours)
- [ ] Create action items for prevention

---

## Useful Commands Cheat Sheet

```bash
# Service management
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml restart api
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Health checks
curl https://api.yourdomain.com/api/health
docker inspect --format='{{.State.Health.Status}}' vaultscope-api

# Resource usage
docker stats
df -h
free -h

# Database
psql ${DATABASE_URL}
pg_dump ${DATABASE_URL} | gzip > backup.sql.gz

# Redis
redis-cli -u ${REDIS_URL} INFO
redis-cli -u ${REDIS_URL} KEYS "oidc:state:*"

# Logs
docker compose -f docker-compose.prod.yml logs api | grep -i error
docker compose -f docker-compose.prod.yml logs --since "1h"
```

---

## Contacts

**On-Call Rotation**: See PagerDuty schedule

**Escalation**:
1. Team Lead
2. Engineering Manager
3. CTO

**External Services**:
- Database: AWS RDS Support
- Redis: AWS ElastiCache Support
- Authentik: Community support / Internal DevOps

---

**Last Updated**: 2026-09-14  
**Next Review**: 2026-10-14  
**Maintained By**: Platform Team
