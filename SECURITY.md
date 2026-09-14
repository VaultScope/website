# VaultScope Security Documentation

**Version**: 1.0.0  
**Last Updated**: 2026-09-14  
**Security Contact**: security@yourdomain.com

---

## Table of Contents

1. [Responsible Disclosure](#responsible-disclosure)
2. [Security Architecture](#security-architecture)
3. [Known Vulnerabilities](#known-vulnerabilities)
4. [Security Fixes Applied](#security-fixes-applied)
5. [Security Best Practices](#security-best-practices)
6. [Incident Response Plan](#incident-response-plan)
7. [Compliance](#compliance)

---

## Responsible Disclosure

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

**Instead, report via**:
- Email: security@yourdomain.com
- Encrypted: Use our PGP key (see below)
- Response time: Within 24 hours

### What to Include

```
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information
```

### Security Bounty

- Severity-based rewards
- Safe harbor for security researchers
- Public acknowledgment (if desired)

### PGP Key

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Insert organization PGP public key]
-----END PGP PUBLIC KEY BLOCK-----
```

---

## Security Architecture

### Authentication & Authorization

**OIDC/OAuth2 Flow**:
1. Frontend requests state from `/api/auth/init-login`
2. State stored in Redis with 10-minute TTL
3. User redirected to Authentik with state parameter
4. User authenticates with Authentik
5. Callback includes authorization code and state
6. API validates state (one-time use)
7. API exchanges code for tokens
8. JWT issued to user

**JWT Structure**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "Owner",
  "audience": "admin",
  "iat": 1726339200,
  "exp": 1726425600
}
```

**Security Features**:
- ✅ Server-generated cryptographic random states (SEC-001)
- ✅ State validation prevents CSRF attacks
- ✅ One-time state use prevents replay attacks
- ✅ 10-minute state TTL prevents stale state reuse
- ✅ JWT audience validation (SEC-003)
- ✅ Strong encryption keys enforced (SEC-002)
- ✅ SSRF protection in connector testing (SEC-004)

### Data Encryption

**At Rest**:
- Database: PostgreSQL encryption (managed by cloud provider)
- Secrets: Encrypted in secrets manager (AWS Secrets Manager, etc.)
- API Keys: Encrypted with AES-256-GCM
- Passwords: N/A (OIDC/SSO only, no local passwords)

**In Transit**:
- HTTPS/TLS 1.3 enforced
- Database connections: SSL required
- Redis connections: TLS recommended
- Internal service communication: TLS (production)

**Encryption Key Management**:
```rust
// API encryption (vaultscope-common/src/crypto.rs)
// - Algorithm: AES-256-GCM
// - Key derivation: Direct (64-char hex key)
// - Nonce: Random 12 bytes per operation
```

### Network Security

**Production Network Architecture**:
```
Internet
    ↓
Load Balancer (HTTPS)
    ↓
Reverse Proxy (Nginx/Traefik)
    ↓
Docker Network (isolated)
    ├── API (internal only)
    ├── Storefront (internal only)
    └── Admin (internal only)

External Services:
- Database (managed, SSL)
- Redis (managed, TLS)
- Authentik (HTTPS)
```

**Firewall Rules**:
- Only ports 80, 443 exposed
- Internal services not accessible externally
- Database: Allowlist API IP only
- Redis: Allowlist API IP only

---

## Known Vulnerabilities

### Active Issues

#### Medium Severity

**1. RSA Timing Side-Channel (RUSTSEC-2023-0071)**
- **Component**: `rsa` crate 0.9.10
- **Status**: NO FIX AVAILABLE
- **CVE**: CVE-2023-48795 related
- **CVSS**: 5.9 (Medium)
- **Impact**: Theoretical timing attack on RSA operations
- **Mitigation**: 
  - Low risk in current usage (OIDC/JWT validation)
  - Not using RSA for direct encryption/decryption
  - Monitoring upstream for patches
- **Action**: Upgrade when fix available

### Fixed Vulnerabilities

All HIGH and CRITICAL vulnerabilities resolved:
- See `SECURITY_FIXES_APPLIED.md` for details
- See `STAGE-2-COMPLETE.md` for dependency updates

---

## Security Fixes Applied

### SEC-001: OIDC State Validation (CRITICAL)
**Date**: 2026-09-14  
**Impact**: CSRF protection in authentication flow  
**Fix**: Server-side state generation and validation with Redis  
**Status**: ✅ COMPLETE

### SEC-002: Strong Encryption Keys (CRITICAL)
**Date**: 2026-09-12  
**Impact**: Weak encryption keys rejected  
**Fix**: Enforced 64-character minimum for keys  
**Status**: ✅ COMPLETE

### SEC-003: JWT Audience Validation (CRITICAL)
**Date**: 2026-09-12  
**Impact**: Prevents token misuse across audiences  
**Fix**: Enforced audience parameter in JWT verification  
**Status**: ✅ COMPLETE

### SEC-004: SSRF Protection (CRITICAL)
**Date**: 2026-09-12  
**Impact**: Prevents internal network scanning  
**Fix**: Validates connector URLs, blocks private IPs  
**Status**: ✅ COMPLETE

---

## Security Best Practices

### For Operators

**Secrets Management**:
```bash
# NEVER commit secrets to version control
.env*
secrets/
*.key
*.pem

# Use secrets manager
aws secretsmanager create-secret --name vaultscope/jwt
az keyvault secret set --vault-name vault --name jwt

# Rotate secrets every 90 days
```

**Access Control**:
- Principle of least privilege
- MFA enforced for production access
- Service accounts: One per service
- Audit logs: Review monthly

**Monitoring**:
```bash
# Monitor failed auth attempts
docker compose logs api | grep -i "unauthorized\|forbidden"

# Monitor unusual activity
# - High rate of 401/403 responses
# - Unusual login times
# - Multiple failed login attempts
# - New IP addresses

# Alert on:
# - Failed auth > 10/min from single IP
# - Database connection errors
# - Redis connection errors
# - Unexpected restarts
```

### For Developers

**Code Security**:
- Input validation on all endpoints
- Parameterized SQL queries (SQLx)
- No eval() or unsafe code execution
- CSRF tokens for state-changing operations
- Rate limiting on authentication endpoints

**Dependencies**:
```bash
# Audit Rust dependencies
cargo audit

# Audit Node dependencies
npm audit

# Update regularly
cargo update
npm update
```

**Testing**:
- Security tests in E2E suite
- Penetration testing annually
- Code review for security changes
- Automated security scans in CI/CD

---

## Incident Response Plan

### Severity Levels

**Critical (P0)**:
- Data breach
- Complete service outage
- Authentication bypass
- Database compromise

**High (P1)**:
- Partial service outage
- Performance degradation
- Failed authentication for many users
- Single-service compromise

**Medium (P2)**:
- Degraded functionality
- High error rates
- Failed authentication for few users

**Low (P3)**:
- Minor bugs
- UI issues
- Documentation errors

### Response Procedure

**1. Detection** (0-5 minutes)
- Alert received (monitoring/user report)
- Verify incident
- Assess severity

**2. Containment** (5-15 minutes)
- Stop the attack/breach
- Isolate affected systems
- Block malicious IPs
- Rotate compromised credentials

**3. Investigation** (15-60 minutes)
- Identify attack vector
- Determine scope of compromise
- Collect evidence (logs, screenshots)
- Timeline of events

**4. Remediation** (1-4 hours)
- Apply security patches
- Remove attacker access
- Restore from backups if needed
- Verify fix effectiveness

**5. Recovery** (4-24 hours)
- Restore normal operations
- Verify security controls
- Monitor for re-compromise
- Update security measures

**6. Post-Incident** (24-72 hours)
- Conduct postmortem
- Document lessons learned
- Update security procedures
- Communicate to stakeholders

### Contact List

**Incident Response Team**:
- Team Lead: [contact]
- Security Engineer: [contact]
- DevOps Lead: [contact]
- Engineering Manager: [contact]

**External Contacts**:
- Cloud Provider Support
- Database Provider Support
- Legal Counsel
- PR/Communications

### Evidence Preservation

```bash
# Capture logs immediately
docker compose logs > incident-logs-$(date +%Y%m%d-%H%M%S).txt

# Database snapshot
pg_dump ${DATABASE_URL} > incident-db-$(date +%Y%m%d-%H%M%S).sql

# Container snapshots
docker commit vaultscope-api incident-api-$(date +%Y%m%d-%H%M%S)

# Network capture (if needed)
tcpdump -i any -w incident-$(date +%Y%m%d-%H%M%S).pcap
```

---

## Compliance

### GDPR

**Data Protection**:
- Customer data encrypted at rest and in transit
- Personal data retention policy: 7 years
- Right to erasure: Implemented via admin API
- Data portability: Export available via API
- Consent tracking: Audit logs

**Data Processing**:
- Purpose limitation: Only for service provision
- Data minimization: Only necessary fields collected
- Accuracy: Users can update their data
- Storage limitation: Automated deletion after 7 years

**Contact**: Data Protection Officer - dpo@yourdomain.com

### SOC 2 (Future)

**Security Controls** (planned):
- Access control policies
- Encryption standards
- Incident response procedures
- Change management
- Monitoring and logging
- Vendor risk management

**Audit Readiness**:
- Security documentation complete
- Access logs retained 1 year
- Incident response tested quarterly
- Annual penetration testing

---

## Security Checklist

### Pre-Production

- [ ] All CRITICAL vulnerabilities fixed
- [ ] Strong secrets generated and stored securely
- [ ] HTTPS enforced on all endpoints
- [ ] Database SSL connections enabled
- [ ] Redis TLS enabled (if applicable)
- [ ] Secrets rotation policy established
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested
- [ ] Incident response plan documented
- [ ] Security training completed

### Ongoing

- [ ] Weekly: Review failed login attempts
- [ ] Monthly: Security patch updates
- [ ] Monthly: Access audit (who has access)
- [ ] Quarterly: Secrets rotation
- [ ] Quarterly: Dependency vulnerability scans
- [ ] Quarterly: Incident response drill
- [ ] Annually: Penetration testing
- [ ] Annually: Security architecture review

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)
- [GDPR Guidelines](https://gdpr.eu/)

---

## Appendix: Security Contacts

**Internal**:
- Security Team: security@yourdomain.com
- On-Call Engineer: Use PagerDuty
- DevOps Team: devops@yourdomain.com

**External**:
- AWS Security: aws-security@amazon.com
- Authentik: https://github.com/goauthentik/authentik/security

**Emergency**:
- If customer data compromised: Notify within 72 hours (GDPR)
- If payment data compromised: Notify immediately (PCI-DSS)
- If active breach: Contact incident response team immediately

---

**Last Security Audit**: 2026-09-14  
**Next Scheduled Audit**: 2027-09-14  
**Maintained By**: Security Team
