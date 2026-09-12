# VaultScope QA Issue Tracker

**QA Run ID:** a7c4f8b2-3d1e-4a6f-9c2b-8e5f7a3d1c9e  
**Generated:** 2026-09-12  
**Total Issues:** 24 (4 critical, 6 high, 11 medium, 3 low)

---

## Issue Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 4 | Open |
| 🟠 High | 6 | Open |
| 🟡 Medium | 11 | Open |
| 🟢 Low | 3 | Open |
| **Total** | **24** | **All Open** |

---

## Critical Issues (P0 - Production Blockers)

### SEC-001: OIDC State Parameter Validation Missing

| Field | Value |
|-------|-------|
| **ID** | SEC-001 |
| **Category** | Security / Authentication |
| **Severity** | CRITICAL |
| **Priority** | P0 |
| **Impact** | Account takeover via CSRF attack on OIDC flow |
| **Affected Files** | `VaultScope-API/src/routes/auth.rs`, `VaultScope-API/src/auth/oidc.rs` |
| **Lines** | auth.rs:45-78, oidc.rs:102-156 |
| **Status** | Open |
| **Assigned To** | Security Team |
| **Estimated Time** | 4-6 hours |
| **Dependencies** | None |
| **Verification Method** | Security test - attempt OIDC callback with modified state parameter |
| **Risk if Unfixed** | Attacker can hijack authentication flow and gain access to victim account |

**Description:**  
The OIDC authentication flow does not validate the `state` parameter returned from Authentik during the callback. This allows CSRF attacks where an attacker can force a victim to authenticate as the attacker's account.

**Remediation:**
1. Generate cryptographically random state parameter before redirect
2. Store state in Redis with 5-minute TTL keyed by session ID
3. Validate state matches on callback
4. Clear state from Redis after validation
5. Reject callback if state is missing, invalid, or expired

**References:**
- OAuth 2.0 RFC 6749 Section 10.12
- OWASP Authentication Cheat Sheet

---

### SEC-002: Weak Encryption Key Handling

| Field | Value |
|-------|-------|
| **ID** | SEC-002 |
| **Category** | Security / Cryptography |
| **Severity** | CRITICAL |
| **Priority** | P0 |
| **Impact** | Credential theft through predictable encryption keys |
| **Affected Files** | `VaultScope-API/src/config.rs` |
| **Lines** | 56-62 |
| **Status** | Open |
| **Assigned To** | Security Team |
| **Estimated Time** | 2-4 hours |
| **Dependencies** | None |
| **Verification Method** | Unit test with short key, should reject |
| **Risk if Unfixed** | Encrypted connector configs vulnerable if ENCRYPTION_KEY < 32 bytes |

**Description:**  
The encryption key validation pads keys shorter than 32 bytes with zeros instead of rejecting them. This creates predictable, weak encryption keys that can be brute-forced.

**Current Code:**
```rust
let key = if key_bytes.len() < 32 {
    let mut padded = key_bytes.to_vec();
    padded.resize(32, 0); // BAD: padding with zeros
    padded
} else {
    key_bytes[..32].to_vec()
};
```

**Remediation:**
```rust
if key_bytes.len() != 32 {
    return Err(ConfigError::InvalidEncryptionKey(
        "ENCRYPTION_KEY must be exactly 32 bytes (base64 encoded)"
    ));
}
```

**References:**
- NIST SP 800-57 Key Management
- AES-256-GCM requires 256-bit (32-byte) key

---

### SEC-003: JWT Audience Not Validated at Token Level

| Field | Value |
|-------|-------|
| **ID** | SEC-003 |
| **Category** | Security / Authorization |
| **Severity** | CRITICAL |
| **Priority** | P0 |
| **Impact** | Privilege escalation - admin tokens could work on storefront |
| **Affected Files** | `VaultScope-API/src/auth/jwt.rs` |
| **Lines** | 18-27 |
| **Status** | Open |
| **Assigned To** | Security Team |
| **Estimated Time** | 3-4 hours |
| **Dependencies** | None |
| **Verification Method** | Try admin JWT on storefront endpoint, should 403 |
| **Risk if Unfixed** | Bypass of audience-based access control if middleware is bypassed |

**Description:**  
JWT audience claim validation happens only in extractor middleware, not during core token verification. If a route bypasses extractors, audience is not checked.

**Current Code:**
```rust
pub fn verify_jwt(token: &str) -> Result<Claims, JwtError> {
    // Validates signature and expiration only
    // Does NOT validate audience claim
}
```

**Remediation:**
```rust
pub fn verify_jwt(token: &str, expected_audience: &str) -> Result<Claims, JwtError> {
    let claims = decode_and_validate(token)?;
    
    if claims.aud != expected_audience {
        return Err(JwtError::InvalidAudience);
    }
    
    Ok(claims)
}
```

**References:**
- RFC 7519 Section 4.1.3 (Audience Claim)
- OWASP JWT Security Cheat Sheet

---

### SEC-004: SSRF in Connector Testing Endpoint

| Field | Value |
|-------|-------|
| **ID** | SEC-004 |
| **Category** | Security / Input Validation |
| **Severity** | CRITICAL |
| **Priority** | P0 |
| **Impact** | Internal network probing, cloud metadata access (AWS/GCP credentials) |
| **Affected Files** | `VaultScope-API/src/routes/admin/connectors.rs` |
| **Lines** | 152-159 |
| **Status** | Open |
| **Assigned To** | Security Team |
| **Estimated Time** | 3-4 hours |
| **Dependencies** | None |
| **Verification Method** | Attempt to test_connection with http://169.254.169.254/, should reject |
| **Risk if Unfixed** | Attacker can probe internal network, access cloud metadata endpoints |

**Description:**  
The `/api/admin/connectors/test-connection` endpoint accepts arbitrary URLs without validation, allowing SSRF attacks against internal services and cloud metadata endpoints.

**Current Code:**
```rust
pub async fn test_connection(config: ConnectorConfig) -> Result<bool> {
    let client = reqwest::Client::new();
    let response = client.get(&config.api_endpoint).send().await?;
    // No URL validation!
}
```

**Remediation:**
1. Validate URL scheme (https only)
2. Block private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
3. Block loopback (127.0.0.0/8, ::1)
4. Block link-local (169.254.0.0/16, fe80::/10)
5. Block cloud metadata endpoints (169.254.169.254)
6. Use allowlist for known connector APIs (Hetzner, AWS, etc.)
7. Set timeout (5s max)

**References:**
- OWASP SSRF Prevention Cheat Sheet
- CWE-918: Server-Side Request Forgery

---

## High Priority Issues (P1)

### DB-001: Plaintext Password Storage in Mailboxes Table

| Field | Value |
|-------|-------|
| **ID** | DB-001 |
| **Category** | Security / Database |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | SMTP credentials exposed in database dumps |
| **Affected Files** | Migration 0001 (mailboxes table) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | Database Team |
| **Estimated Time** | 2-3 hours |
| **Dependencies** | None |
| **Verification Method** | Check mailboxes.password column type is BYTEA, not TEXT |
| **Risk if Unfixed** | SMTP passwords visible to DBAs and in backups |

**Description:**  
`mailboxes.password` column stores SMTP passwords as plaintext TEXT instead of encrypted BYTEA like `connectors.config_encrypted`.

**Remediation:**
```sql
-- Migration: encrypt-mailbox-passwords
ALTER TABLE mailboxes ADD COLUMN password_encrypted BYTEA;
-- Migrate data using encryption function
UPDATE mailboxes SET password_encrypted = encrypt_value(password);
ALTER TABLE mailboxes DROP COLUMN password;
ALTER TABLE mailboxes RENAME COLUMN password_encrypted TO password;
```

**References:**
- Database verification report: `database-verification/integrity-issues.json` line 94-99

---

### DB-002 to DB-016: Missing Foreign Key Indexes (15 issues)

| Field | Value |
|-------|-------|
| **ID** | DB-002 through DB-016 |
| **Category** | Performance / Database |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | Query performance degradation (50-100ms penalty per query) |
| **Affected Files** | Various tables (see detail below) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | Database Team |
| **Estimated Time** | 1 hour (execute recommended-fixes.sql) |
| **Dependencies** | None |
| **Verification Method** | Query pg_indexes, confirm all FK columns have indexes |
| **Risk if Unfixed** | Slow joins, poor performance at scale |

**Description:**  
15 foreign key columns lack indexes, causing sequential scans on joins and slow CASCADE operations.

**Critical Missing Indexes:**
- `invoice_line_items.invoice_id` → invoices.id (high volume)
- `jobs.connector_id` → connectors.id (queue processing)
- `services.connector_id` → connectors.id (common query)
- `tickets.assignee_id` → staff.id (staff dashboards)

**Remediation:**  
Execute `database-verification/recommended-fixes.sql` which contains:
```sql
CREATE INDEX idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX idx_jobs_connector ON jobs(connector_id);
CREATE INDEX idx_services_connector ON services(connector_id);
CREATE INDEX idx_tickets_assignee ON tickets(assignee_id);
-- ... 11 more indexes
```

**References:**
- Database verification report: `database-verification/indexes-report.json` lines 70-176

---

### SEC-005: Encrypted Configs Exposed to Clients

| Field | Value |
|-------|-------|
| **ID** | SEC-005 |
| **Category** | Security / Data Exposure |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | Encrypted connector configs visible in API responses |
| **Affected Files** | `VaultScope-API/src/routes/admin/connectors.rs` |
| **Lines** | Connector serialization |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 2 hours |
| **Dependencies** | None |
| **Verification Method** | GET /api/admin/connectors, check config_encrypted not in response |
| **Risk if Unfixed** | Encrypted data exposed unnecessarily, attack surface for decryption attempts |

**Description:**  
API returns `config_encrypted` BYTEA field in connector responses. While encrypted, this increases attack surface.

**Remediation:**
```rust
#[derive(Serialize)]
pub struct ConnectorResponse {
    pub id: Uuid,
    pub name: String,
    // Remove: config_encrypted
    pub connector_type: String,
    pub is_active: bool,
}
```

---

### SEC-006: Rate Limiting Only on Admin Routes

| Field | Value |
|-------|-------|
| **ID** | SEC-006 |
| **Category** | Security / DoS Prevention |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | Storefront and auth endpoints unprotected from abuse |
| **Affected Files** | `VaultScope-API/src/middleware/rate_limit.rs` |
| **Lines** | Middleware application |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 3-4 hours |
| **Dependencies** | None |
| **Verification Method** | Rapid requests to /api/auth/register, should get 429 |
| **Risk if Unfixed** | Registration spam, brute force attacks, resource exhaustion |

**Description:**  
Rate limiting (100 req/60s) only applied to `/api/admin/*` routes. Storefront and auth endpoints unprotected.

**Remediation:**
```rust
// Apply tiered rate limiting
// Auth endpoints: 10 req/min per IP
// Storefront: 100 req/min per IP
// Admin: 100 req/60s per user (existing)
```

---

### SEC-007: IP Spoofing via X-Forwarded-For

| Field | Value |
|-------|-------|
| **ID** | SEC-007 |
| **Category** | Security / Rate Limiting |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | Rate limit bypass by spoofing source IP |
| **Affected Files** | `VaultScope-API/src/middleware/rate_limit.rs` |
| **Lines** | IP extraction logic |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 2 hours |
| **Dependencies** | None |
| **Verification Method** | Send requests with fake X-Forwarded-For, should use real IP |
| **Risk if Unfixed** | Attackers can bypass rate limiting by setting X-Forwarded-For header |

**Description:**  
Rate limiter trusts `X-Forwarded-For` header without validation, allowing IP spoofing.

**Remediation:**
```rust
// Only trust X-Forwarded-For if from known proxy IPs
// Otherwise use direct connection IP
fn get_client_ip(req: &Request) -> IpAddr {
    if is_from_trusted_proxy(req.peer_addr()) {
        parse_x_forwarded_for(req).unwrap_or(req.peer_addr())
    } else {
        req.peer_addr() // Don't trust header
    }
}
```

---

### SEC-008: Database Error Information Leakage

| Field | Value |
|-------|-------|
| **ID** | SEC-008 |
| **Category** | Security / Information Disclosure |
| **Severity** | HIGH |
| **Priority** | P1 |
| **Impact** | Database schema and query details exposed in error messages |
| **Affected Files** | `VaultScope-API/src/error.rs` |
| **Lines** | Error serialization |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 2 hours |
| **Dependencies** | None |
| **Verification Method** | Trigger database error, check response doesn't contain SQL |
| **Risk if Unfixed** | Assists attackers in understanding database structure |

**Description:**  
Database errors returned to client contain detailed SQL error messages including table names, constraints, and query fragments.

**Remediation:**
```rust
// Sanitize database errors
match db_error {
    SqlxError::Database(e) => {
        log::error!("Database error: {}", e); // Log full error server-side
        HttpResponse::InternalServerError()
            .json(json!({"error": "Database operation failed"})) // Generic to client
    }
}
```

---

## Medium Priority Issues (P2)

### SEC-009: Hardcoded Authentik Group ID

| Field | Value |
|-------|-------|
| **ID** | SEC-009 |
| **Category** | Configuration / Maintenance |
| **Severity** | MEDIUM |
| **Priority** | P2 |
| **Impact** | Breaks if Authentik group recreated, deployment inflexibility |
| **Affected Files** | `VaultScope-API/src/auth/oidc.rs` |
| **Lines** | Group ID comparison |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 1 hour |
| **Dependencies** | None |
| **Verification Method** | Check group ID comes from environment variable |
| **Risk if Unfixed** | System breaks if Authentik reinstalled or group recreated |

**Remediation:**
```rust
// Add to .env
AUTHENTIK_ADMIN_GROUP_NAME=vaultscope_admins

// Check by name instead of UUID
fn is_admin(groups: &[String]) -> bool {
    let admin_group = env::var("AUTHENTIK_ADMIN_GROUP_NAME").unwrap();
    groups.contains(&admin_group)
}
```

---

### SEC-010: Weak Email Validation

| Field | Value |
|-------|-------|
| **ID** | SEC-010 |
| **Category** | Input Validation |
| **Severity** | MEDIUM |
| **Priority** | P2 |
| **Impact** | Invalid emails accepted, poor user experience |
| **Affected Files** | `VaultScope-API/src/validators.rs` |
| **Lines** | Email validation function |
| **Status** | Open |
| **Assigned To** | Backend Team |
| **Estimated Time** | 1 hour |
| **Dependencies** | None |
| **Verification Method** | Test with invalid emails (missing TLD, special chars) |
| **Risk if Unfixed** | Spam registrations, bounce emails |

**Remediation:**
```rust
// Use proper email validation library
use validator::Validate;

#[derive(Validate)]
struct RegistrationRequest {
    #[validate(email)]
    email: String,
}
```

---

### PERF-001: Database Timestamp Type Inconsistency

| Field | Value |
|-------|-------|
| **ID** | PERF-001 |
| **Category** | Database / Schema |
| **Severity** | MEDIUM |
| **Priority** | P2 |
| **Impact** | Potential timezone bugs when comparing timestamps |
| **Affected Files** | Migration 0001 (mailboxes table) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | Database Team |
| **Estimated Time** | 30 minutes |
| **Dependencies** | None |
| **Verification Method** | Check all timestamp columns use timestamptz |
| **Risk if Unfixed** | Timezone-related bugs, inconsistent timestamp comparisons |

**Remediation:**
```sql
ALTER TABLE mailboxes 
ALTER COLUMN created_at TYPE timestamp with time zone;
```

---

### DEP-001 to DEP-035: NPM Security Vulnerabilities

| Field | Value |
|-------|-------|
| **ID** | DEP-001 through DEP-035 |
| **Category** | Dependencies / Security |
| **Severity** | MEDIUM (1 high, 34 moderate) |
| **Priority** | P2 |
| **Impact** | Potential XSS, prototype pollution, DoS from dependencies |
| **Affected Files** | package.json, package-lock.json (both frontends) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | Frontend Team |
| **Estimated Time** | 2-4 hours |
| **Dependencies** | None |
| **Verification Method** | Run npm audit, should show 0 vulnerabilities |
| **Risk if Unfixed** | Depends on specific vulnerabilities, varies by severity |

**Remediation:**
```bash
cd VaultScope
npm audit fix
npm audit fix --force  # If needed for breaking changes

cd ../VaultScope-Admin
npm audit fix
npm audit fix --force

# Verify no new vulnerabilities
npm audit
```

---

### CONFIG-001 to CONFIG-010: Other Medium Priority Issues

Various configuration, logging, and minor security issues documented in FINAL_QA_REPORT.md.

---

## Low Priority Issues (P3)

### TEST-001: 3 API Integration Tests Need PostgreSQL

| Field | Value |
|-------|-------|
| **ID** | TEST-001 |
| **Category** | Testing / Environment |
| **Severity** | LOW |
| **Priority** | P3 |
| **Impact** | 3 tests skipped in CI if PostgreSQL not available |
| **Affected Files** | `VaultScope-API/tests/integration/*.rs` |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | QA Team |
| **Estimated Time** | 1-2 hours |
| **Dependencies** | CI/CD PostgreSQL service container |
| **Verification Method** | All 659 tests pass including integration tests |
| **Risk if Unfixed** | Integration tests not run in CI, potential bugs slip through |

**Remediation:**
```yaml
# .github/workflows/test.yml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
```

---

### DOCKER-001: Docker Images Run as Root

| Field | Value |
|-------|-------|
| **ID** | DOCKER-001 |
| **Category** | Security / Containers |
| **Severity** | LOW |
| **Priority** | P3 |
| **Impact** | Container escape has elevated privileges |
| **Affected Files** | Dockerfile (API, Storefront, Admin) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | DevOps Team |
| **Estimated Time** | 2 hours |
| **Dependencies** | None |
| **Verification Method** | docker exec check USER is not root |
| **Risk if Unfixed** | Increased blast radius if container compromised |

**Remediation:**
```dockerfile
# Add to all Dockerfiles
RUN useradd -m -u 1000 appuser
USER appuser
```

---

### DOCKER-002: Missing Health Checks in Dockerfiles

| Field | Value |
|-------|-------|
| **ID** | DOCKER-002 |
| **Category** | Observability / Containers |
| **Severity** | LOW |
| **Priority** | P3 |
| **Impact** | Docker doesn't know if containers are actually healthy |
| **Affected Files** | Dockerfile (API, Storefront, Admin) |
| **Lines** | N/A |
| **Status** | Open |
| **Assigned To** | DevOps Team |
| **Estimated Time** | 1 hour |
| **Dependencies** | None |
| **Verification Method** | docker ps shows healthy status |
| **Risk if Unfixed** | Orchestrators can't detect unhealthy containers |

**Remediation:**
```dockerfile
# API Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Frontend Dockerfiles
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD curl -f http://localhost:3000/ || exit 1
```

---

## Issue Status Tracking

### By Status

| Status | Count | Percentage |
|--------|-------|------------|
| Open | 24 | 100% |
| In Progress | 0 | 0% |
| Fixed | 0 | 0% |
| Verified | 0 | 0% |
| Closed | 0 | 0% |

### By Team Assignment

| Team | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
| Security Team | 4 | 4 | 1 | 0 | 9 |
| Database Team | 0 | 16 | 1 | 0 | 17 |
| Backend Team | 0 | 2 | 2 | 0 | 4 |
| Frontend Team | 0 | 0 | 35 | 0 | 35 |
| DevOps Team | 0 | 0 | 0 | 2 | 2 |
| QA Team | 0 | 0 | 0 | 1 | 1 |

Note: Numbers higher than 24 because some issues are groups (e.g., DB-002 to DB-016 is 15 issues, DEP-001 to DEP-035 is 35 issues).

### By Time to Fix

| Duration | Count |
|----------|-------|
| < 1 hour | 4 |
| 1-2 hours | 7 |
| 2-4 hours | 9 |
| 4-6 hours | 2 |
| > 6 hours | 2 |

**Total Estimated Effort:** 50-70 hours (with parallelization: 24-36 hours)

---

## Verification Checklist

After fixes are applied, verify each issue:

### Critical Issues
- [ ] SEC-001: Test OIDC with modified state parameter, should reject
- [ ] SEC-002: Test with 16-byte encryption key, should reject
- [ ] SEC-003: Test admin JWT on storefront endpoint, should 403
- [ ] SEC-004: Test connector with http://169.254.169.254/, should reject

### High Priority
- [ ] DB-001: Verify mailboxes.password is BYTEA and encrypted
- [ ] DB-002-016: Query pg_indexes, all FK columns should have indexes
- [ ] SEC-005: GET /api/admin/connectors, config_encrypted not in response
- [ ] SEC-006: Rapid requests to auth endpoints return 429
- [ ] SEC-007: Fake X-Forwarded-For doesn't bypass rate limiting
- [ ] SEC-008: Trigger DB error, response should be generic

### Medium Priority
- [ ] SEC-009: Group ID from environment, not hardcoded
- [ ] SEC-010: Invalid emails rejected
- [ ] PERF-001: mailboxes.created_at is timestamptz
- [ ] DEP-001-035: npm audit shows 0 vulnerabilities

### Low Priority
- [ ] TEST-001: All 659 tests pass in CI
- [ ] DOCKER-001: Containers run as non-root user
- [ ] DOCKER-002: docker ps shows HEALTHY status

---

## Related Documents

- **FINAL_QA_REPORT.md** - Detailed findings for each issue
- **EXECUTIVE_DASHBOARD.md** - Visual risk heat map
- **HANDOFF.md** - Team assignments and next steps
- **database-verification/recommended-fixes.sql** - Ready-to-execute DB fixes

---

**Tracker Generated:** 2026-09-12  
**QA Run:** a7c4f8b2-3d1e-4a6f-9c2b-8e5f7a3d1c9e  
**Last Updated:** Workstream 5B completion
