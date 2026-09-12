# VaultScope End-to-End QA Coordination Plan

## Task Summary

Execute comprehensive quality assurance across VaultScope's three repositories (Storefront, Admin, API) including unit testing, Docker build validation, live infrastructure deployment to Hetzner CX33, Authentik OIDC configuration, end-to-end functional testing, RBAC validation, security testing, and database verification. Critical constraint: preserve 2,182 lines of uncommitted API changes during deployment.

**Deliverables:**
- All unit tests passing (586 total tests across 3 repos)
- Working Docker images with VITE_* env var fixes
- Fully provisioned Hetzner test environment with complete stack
- Configured Authentik with 6 test users and proper OIDC audiences
- Validated E2E workflows for storefront and admin (all 32+ routes)
- Verified RBAC matrix for all 4 roles (Owner, Support, Billing, Technical)
- Security audit report covering JWT, OIDC, CSRF, rate limiting
- API contract validation via direct curl testing
- Database schema validation report
- Hetzner connector lifecycle verification
- Final code review and security audit summary
- Comprehensive test report with cleanup confirmation

---

## Agent Inventory

**Available Agents:** 4 specialized VoltAgent teams + 1 security orchestrator

1. **voltagent-qa-sec** - code-reviewer, security-auditor, penetration-tester, accessibility-tester, performance-engineer, debugger, test-automator, ui-ux-tester
2. **voltagent-core-dev** - frontend-developer, backend-developer, fullstack-developer, api-designer
3. **voltagent-infra** - devops-engineer, docker-expert, deployment-engineer, sre-engineer, cloud-architect, database-administrator
4. **voltagent-meta** - context-manager, multi-agent-coordinator, error-coordinator
5. **claude-security** - Full security orchestrator

---

## Workstream Breakdown

### Stage 1: Foundation & Build Validation (Sequential)

#### Workstream 1A: Unit Test Execution
**Agent:** voltagent-qa-sec (test-automator role)  
**Objective:** Run all unit tests across 3 repositories to establish baseline quality  
**Dependencies:** None (starting point)  
**Can Run in Parallel:** Yes - spawn 3 parallel sub-tasks (one per repo)

**Subtasks:**
- 1A.1: Storefront unit tests (~330 tests) - `npm test` in D:\Projects\Pegasus\VaultScope
- 1A.2: Admin unit tests (~183 tests) - `npm test` in D:\Projects\Pegasus\VaultScope-Admin
- 1A.3: API unit tests (~73 tests) - `cargo test` in D:\Projects\Pegasus\VaultScope-API

**Artifacts Produced:**
- `test-results/storefront-unit.json` - JUnit/JSON test results
- `test-results/admin-unit.json` - JUnit/JSON test results
- `test-results/api-unit.json` - Cargo test output
- `test-results/unit-summary.md` - Consolidated pass/fail summary

**Risk Areas:**
- Storefront/Admin: TypeScript compiler may fail on `.test.tsx` files (known issue with Docker builds)
- API: Uncommitted changes may introduce test failures in 47 modified files
- Test isolation issues if tests share state or database connections

---

#### Workstream 1B: Docker Build Validation & Fixes
**Agent:** voltagent-infra (docker-expert + deployment-engineer roles)  
**Objective:** Build Docker images for all 3 services, fix known Dockerfile issues  
**Dependencies:** Must start after 1A completes (need clean unit tests)  
**Can Run in Parallel:** No - sequential within this workstream, but can parallelize after fixes identified

**Subtasks:**
- 1B.1: Attempt Docker build for storefront with current Dockerfile
- 1B.2: Attempt Docker build for admin with current Dockerfile
- 1B.3: Fix Dockerfile issues:
  - Replace `npm run build` with `npx vite build` in both frontend Dockerfiles
  - Add `--build-arg` declarations for all VITE_* environment variables
  - Update build commands to pass VITE_API_URL, VITE_ADMIN_URL, etc.
- 1B.4: Build API Docker image (preserve uncommitted changes via `COPY . .`)
- 1B.5: Rebuild storefront and admin with fixes
- 1B.6: Tag images: `vaultscope-storefront:test`, `vaultscope-admin:test`, `vaultscope-api:test`

**Artifacts Produced:**
- `docker-images/storefront.tar` - Exportable image
- `docker-images/admin.tar` - Exportable image
- `docker-images/api.tar` - Exportable image
- `docker-build-log.txt` - Full build output for debugging
- `Dockerfile.storefront.fixed` - Corrected Dockerfile with vite build fix
- `Dockerfile.admin.fixed` - Corrected Dockerfile with vite build fix

**Artifacts Consumed:**
- `test-results/unit-summary.md` (verify tests passed before building)

**Risk Areas:**
- VITE_* env vars not properly passed to Docker build context (frontend will have wrong API URLs)
- API uncommitted changes include new dependencies not in Cargo.toml
- Rust build may fail if .sqlx directory conflicts with offline mode
- Image sizes may be excessive without multi-stage builds

---

### Stage 2: Infrastructure Provisioning (Sequential)

#### Workstream 2A: Hetzner Server Provisioning
**Agent:** voltagent-infra (cloud-architect + sre-engineer roles)  
**Objective:** Provision Hetzner CX33 instance with Ubuntu 24.04 and deploy full stack  
**Dependencies:** Must complete after 1B (needs Docker images)  
**Can Run in Parallel:** No

**Subtasks:**
- 2A.1: Provision Hetzner CX33 via Hetzner Cloud API
  - Server name: `vaultscope-qa-test`
  - Image: Ubuntu 24.04
  - Location: Falkenstein (fsn1) or Nuremberg (nbg1)
  - SSH key injection for access
- 2A.2: Install Docker and docker-compose on server
- 2A.3: Transfer Docker images to server (scp or docker save/load)
- 2A.4: Deploy docker-compose stack:
  - PostgreSQL 16 (with vaultscope database)
  - Redis 7
  - Authentik (latest) with PostgreSQL backend
  - VaultScope API (port 8000)
  - VaultScope Storefront (port 3000)
  - VaultScope Admin (port 3001)
- 2A.5: Configure networking (firewall rules, internal network, expose ports)
- 2A.6: Apply database migrations (0001 through 0010 including uncommitted)
- 2A.7: Verify all services healthy via health check endpoints

**Artifacts Produced:**
- `infrastructure/hetzner-server-info.json` - IP, credentials, server ID
- `infrastructure/docker-compose.yml` - Deployed compose file
- `infrastructure/deployment-log.txt` - Full deployment output
- `infrastructure/service-endpoints.txt` - All service URLs and ports

**Artifacts Consumed:**
- `docker-images/*.tar` (from 1B)
- Database migration files from API repo (0001-0010)

**Risk Areas:**
- Network connectivity issues between containers
- PostgreSQL initialization timing (API may start before DB ready)
- Authentik initial setup requires manual admin password creation
- Uncommitted migrations (0003-0010) may have dependencies on earlier schema
- Rate limiting configuration (100 req/60s) needs proper Redis connection

---

#### Workstream 2B: Authentik OIDC Configuration
**Agent:** voltagent-infra (sre-engineer role) + voltagent-qa-sec (test-automator for user creation)  
**Objective:** Configure Authentik with groups, OIDC providers, and 6 test users  
**Dependencies:** Must complete after 2A (needs Authentik running)  
**Can Run in Parallel:** No

**Subtasks:**
- 2B.1: Initial Authentik admin login and setup
- 2B.2: Create groups: `customers`, `support`, `billing`, `technical`, `owners`
- 2B.3: Create OIDC provider for storefront:
  - Client ID: `vaultscope-storefront`
  - Audience: `vaultscope-storefront`
  - Redirect URI: `http://<server-ip>:3000/auth/callback`
  - Scopes: openid, profile, email
- 2B.4: Create OIDC provider for admin:
  - Client ID: `vaultscope-admin`
  - Audience: `vaultscope-admin`
  - Redirect URI: `http://<server-ip>:3001/auth/callback`
  - Scopes: openid, profile, email, groups
- 2B.5: Create test users with proper group assignments:
  - `customer1@test.local` (customers group)
  - `customer2@test.local` (customers group)
  - `admin1@test.local` (owners group)
  - `support1@test.local` (support group)
  - `billing1@test.local` (billing group)
  - `tech1@test.local` (technical group)
- 2B.6: Verify OIDC discovery endpoints accessible
- 2B.7: Test token generation for each user/audience combination

**Artifacts Produced:**
- `authentik-config/users.json` - All test user credentials
- `authentik-config/oidc-providers.json` - Client IDs, secrets, audience configs
- `authentik-config/groups.json` - Group memberships
- `authentik-config/test-tokens.json` - Sample JWT tokens for each user

**Artifacts Consumed:**
- `infrastructure/service-endpoints.txt` (Authentik URL)

**Risk Areas:**
- Audience separation critical (admin tokens must not work on storefront)
- Group claims must be included in admin JWT but not storefront
- Redirect URI mismatches will break OIDC flow
- Token expiration times need to be long enough for testing

---

### Stage 3: Functional Testing (Parallel Streams)

#### Workstream 3A: Storefront End-to-End Testing
**Agent:** voltagent-qa-sec (test-automator + ui-ux-tester roles)  
**Objective:** Validate all public storefront routes, forms, German locale, responsive design  
**Dependencies:** Must complete after 2B (needs Authentik configured)  
**Can Run in Parallel:** Yes - can run alongside 3B, 3D

**Subtasks:**
- 3A.1: Playwright setup targeting `http://<server-ip>:3000`
- 3A.2: Public route testing:
  - Home, About, Contact, Pricing, Projects, OpenSource, Pegasus
  - Infrastructure overview, cloud, dedicated
  - Legal pages (AUP, DPA, Cancellation, Privacy, Terms)
  - Blog list and detail pages
  - Forum list, category, thread pages
- 3A.3: German locale testing:
  - Switch to /de/ URLs
  - Verify translations for nav, home, infrastructure, waitlistForm
  - Test language switcher component
- 3A.4: Form testing:
  - WaitlistForm submission (with Toast notifications)
  - Contact form submission
  - Newsletter signup
- 3A.5: Responsive design testing (mobile, tablet, desktop viewports)
- 3A.6: 404 page handling
- 3A.7: Customer dashboard (requires login as customer1@test.local)

**Artifacts Produced:**
- `e2e-results/storefront-playwright-report.html` - Playwright HTML report
- `e2e-results/storefront-screenshots/` - Screenshots of all pages
- `e2e-results/storefront-failures.json` - Failed test details

**Artifacts Consumed:**
- `infrastructure/service-endpoints.txt` (storefront URL)
- `authentik-config/users.json` (customer1 credentials)

**Risk Areas:**
- OIDC callback flow may timeout or fail in headless browser
- German translations may have missing keys (recently added i18n)
- Form submissions may fail if API rate limiting too aggressive
- Toast notifications may not render in time for assertions

---

#### Workstream 3B: Admin Owner End-to-End Testing
**Agent:** voltagent-qa-sec (test-automator + ui-ux-tester roles)  
**Objective:** Validate all 32+ admin routes with Owner role, OIDC flow, sidebar visibility  
**Dependencies:** Must complete after 2B (needs Authentik configured)  
**Can Run in Parallel:** Yes - can run alongside 3A, 3D

**Subtasks:**
- 3B.1: Playwright setup targeting `http://<server-ip>:3001`
- 3B.2: OIDC authentication flow:
  - Login as admin1@test.local (Owner role)
  - Verify redirect to Authentik
  - Verify callback to /auth/callback
  - Verify JWT stored in session
- 3B.3: Dashboard and sidebar navigation:
  - Verify all menu items visible (Owner sees everything)
  - Test sidebar collapse/expand
- 3B.4: Admin route testing (all 32+ routes):
  - Dashboard, Analytics, Reports
  - User management (list, create, edit, delete)
  - Server management (list, create, provision, power actions)
  - Billing (invoices, subscriptions, payments)
  - Support tickets (list, view, respond, close)
  - System settings (general, OIDC, SMTP, rate limits)
  - Audit logs
  - Hetzner connector settings
- 3B.5: CRUD operations:
  - Create test user
  - Create test server order
  - Update settings
  - Verify changes persist
- 3B.6: Pagination and search functionality

**Artifacts Produced:**
- `e2e-results/admin-owner-playwright-report.html` - Playwright HTML report
- `e2e-results/admin-owner-screenshots/` - Screenshots of all admin pages
- `e2e-results/admin-owner-failures.json` - Failed test details

**Artifacts Consumed:**
- `infrastructure/service-endpoints.txt` (admin URL)
- `authentik-config/users.json` (admin1 credentials)

**Risk Areas:**
- OIDC audience mismatch (storefront tokens must not work here)
- Sidebar menu items may not match actual route permissions
- CRUD operations may fail due to database constraints
- Rate limiting on admin routes (100 req/60s) may block rapid test execution

---

#### Workstream 3C: RBAC Restricted Role Testing
**Agent:** voltagent-qa-sec (test-automator + security-auditor roles)  
**Objective:** Verify permission matrix for Support, Billing, Technical roles  
**Dependencies:** Must complete after 3B (needs Owner baseline established)  
**Can Run in Parallel:** No - sequential after 3B to reuse test infrastructure

**Subtasks:**
- 3C.1: Support role testing (support1@test.local):
  - Can access: support tickets, user list (read-only), audit logs
  - Cannot access: billing, server provisioning, system settings
  - Test sidebar menu visibility (only allowed items show)
- 3C.2: Billing role testing (billing1@test.local):
  - Can access: invoices, subscriptions, payments, user billing info
  - Cannot access: server provisioning, support tickets, system settings
  - Test invoice creation and payment recording
- 3C.3: Technical role testing (tech1@test.local):
  - Can access: server management, Hetzner connector, power actions
  - Cannot access: billing, user management, system settings
  - Test server provision and power cycle operations
- 3C.4: Cross-role boundary testing:
  - Attempt Support access to /admin/billing (should 403)
  - Attempt Billing access to /admin/servers (should 403)
  - Attempt Technical access to /admin/users/create (should 403)

**Artifacts Produced:**
- `rbac-results/support-role-report.json` - Support permission matrix validation
- `rbac-results/billing-role-report.json` - Billing permission matrix validation
- `rbac-results/technical-role-report.json` - Technical permission matrix validation
- `rbac-results/boundary-violations.json` - Failed access attempts (should be empty)

**Artifacts Consumed:**
- `authentik-config/users.json` (support1, billing1, tech1 credentials)
- `e2e-results/admin-owner-playwright-report.html` (baseline comparison)

**Risk Areas:**
- RBAC middleware may not properly check group claims in JWT
- Sidebar may show items user cannot actually access (UI vs API mismatch)
- Wildcard permissions for Owner may not be correctly implemented
- Group claims may not propagate from Authentik to API correctly

---

#### Workstream 3D: RBAC Escalation Testing
**Agent:** voltagent-qa-sec (test-automator role) + voltagent-core-dev (api-designer for endpoint validation)  
**Objective:** Test user promotion flows: customer → staff → owner  
**Dependencies:** Must complete after 3C (needs all roles validated)  
**Can Run in Parallel:** No - sequential after 3C

**Subtasks:**
- 3D.1: Baseline customer access (customer2@test.local):
  - Login to storefront
  - Verify customer dashboard access only
  - Verify admin panel returns 403
- 3D.2: Promote customer2 to Support role:
  - API call: `POST /admin/users/{customer2_id}/promote` with role=support
  - Re-authenticate to get new JWT with updated groups
  - Verify admin panel access with support permissions
- 3D.3: Promote support to Billing role:
  - API call: `POST /admin/users/{customer2_id}/promote` with role=billing
  - Verify permission expansion (now has both support + billing)
- 3D.4: Promote to Owner role:
  - API call: `POST /admin/users/{customer2_id}/promote` with role=owner
  - Verify wildcard permissions granted
  - Verify all admin routes accessible
- 3D.5: Demotion testing:
  - Demote owner back to customer
  - Verify admin access revoked immediately (JWT invalidation)

**Artifacts Produced:**
- `rbac-results/escalation-report.json` - Promotion flow validation
- `rbac-results/demotion-report.json` - Demotion flow validation

**Artifacts Consumed:**
- `authentik-config/users.json` (customer2 credentials)
- `rbac-results/support-role-report.json` (baseline comparisons)

**Risk Areas:**
- JWT may not refresh after role change (cached permissions)
- Promotion endpoint may not properly update Authentik groups
- Demotion may not invalidate existing JWT tokens
- Role changes may require re-login to take effect

---

### Stage 4: Security & API Validation (Parallel Streams)

#### Workstream 4A: Security Testing
**Agent:** claude-security (full security orchestrator) + voltagent-qa-sec (penetration-tester + security-auditor roles)  
**Objective:** Comprehensive security testing covering JWT, OIDC, CSRF, rate limiting, registration abuse  
**Dependencies:** Must complete after Stage 3 (needs all functional flows working)  
**Can Run in Parallel:** Yes - can run alongside 4B, 4C, 4D

**Subtasks:**
- 4A.1: Fake JWT testing:
  - Generate JWT with invalid signature
  - Generate JWT with valid signature but wrong audience
  - Generate expired JWT
  - Attempt access to protected endpoints (all should 401)
- 4A.2: Cross-audience JWT testing:
  - Use storefront JWT on admin endpoints (should 403)
  - Use admin JWT on storefront endpoints (should reject)
  - Verify audience claim validation strict
- 4A.3: CSRF protection testing:
  - Attempt state-changing requests without CSRF token
  - Test CSRF token generation and validation
  - Verify SameSite cookie attributes
- 4A.4: OIDC state parameter testing:
  - Intercept OIDC flow and modify state parameter
  - Replay old OIDC callback requests
  - Test PKCE challenge/verifier flow if implemented
- 4A.5: Registration abuse testing:
  - Rapid registration attempts (test rate limiting)
  - Duplicate email registration
  - Invalid email formats
  - SQL injection attempts in registration form
- 4A.6: Rate limiting validation:
  - Admin routes: verify 100 req/60s limit enforced
  - Test limit per IP vs per user
  - Verify 429 status and Retry-After header
- 4A.7: Session security:
  - Test session fixation
  - Test concurrent session limits
  - Verify secure session storage

**Artifacts Produced:**
- `security-results/jwt-testing-report.json` - All JWT attack vectors tested
- `security-results/csrf-testing-report.json` - CSRF protection validation
- `security-results/oidc-security-report.json` - OIDC flow security
- `security-results/rate-limiting-report.json` - Rate limit enforcement
- `security-results/registration-abuse-report.json` - Registration security
- `security-results/vulnerabilities-found.json` - Critical issues requiring fixes

**Artifacts Consumed:**
- `authentik-config/test-tokens.json` (valid JWT samples)
- `infrastructure/service-endpoints.txt` (all endpoints)

**Risk Areas:**
- JWT verification may accept tokens with wrong audience (critical)
- Rate limiting may not be properly configured in Redis
- CSRF tokens may be optional rather than required
- OIDC state validation may be missing entirely
- Registration may lack email verification (spam risk)

---

#### Workstream 4B: Direct API Testing
**Agent:** voltagent-core-dev (api-designer + backend-developer roles)  
**Objective:** Validate API contracts via direct curl requests (registration, storefront, admin endpoints)  
**Dependencies:** Must complete after Stage 3 (needs infrastructure running)  
**Can Run in Parallel:** Yes - can run alongside 4A, 4C, 4D

**Subtasks:**
- 4B.1: Registration endpoint testing:
  - `POST /api/auth/register` with valid customer data
  - Verify 201 response and user created in database
  - Test validation errors (missing fields, invalid email)
- 4B.2: Storefront endpoint testing:
  - `GET /api/products` (public endpoint)
  - `GET /api/pricing` (public endpoint)
  - `POST /api/waitlist` with email
  - `POST /api/contact` with form data
- 4B.3: Customer dashboard endpoints (requires authentication):
  - `GET /api/customer/servers` with customer1 JWT
  - `GET /api/customer/invoices` with customer1 JWT
  - `POST /api/customer/servers/order` to create new order
- 4B.4: Admin endpoints (requires owner JWT):
  - `GET /api/admin/users` with admin1 JWT
  - `POST /api/admin/users` to create user
  - `GET /api/admin/servers` with admin1 JWT
  - `POST /api/admin/servers/{id}/power` to test power actions
- 4B.5: Response format validation:
  - Verify JSON schema compliance
  - Verify HTTP status codes match OpenAPI spec
  - Verify error responses include proper error codes
- 4B.6: Content-Type and Accept header handling
- 4B.7: CORS header validation

**Artifacts Produced:**
- `api-testing/registration-curl-tests.sh` - Executable test script
- `api-testing/storefront-curl-tests.sh` - Executable test script
- `api-testing/admin-curl-tests.sh` - Executable test script
- `api-testing/api-test-results.json` - All endpoint test results
- `api-testing/response-schemas.json` - Captured response structures

**Artifacts Consumed:**
- `authentik-config/test-tokens.json` (JWT tokens for authenticated requests)
- `infrastructure/service-endpoints.txt` (API base URL)

**Risk Areas:**
- API may return 200 for errors instead of proper status codes
- Response schemas may not match OpenAPI documentation
- CORS may be misconfigured (block legitimate requests)
- Error messages may leak sensitive information (stack traces)

---

#### Workstream 4C: Database Verification
**Agent:** voltagent-infra (database-administrator role)  
**Objective:** Validate all tables, PKs, FKs, constraints, indexes, and migrations applied correctly  
**Dependencies:** Must complete after Stage 3 (needs database populated)  
**Can Run in Parallel:** Yes - can run alongside 4A, 4B, 4D

**Subtasks:**
- 4C.1: Schema introspection:
  - Query `information_schema.tables` for all VaultScope tables
  - Verify expected tables exist (users, servers, invoices, orders, audit_logs, etc.)
- 4C.2: Primary key validation:
  - Verify every table has a primary key
  - Check PK column types (UUID vs BIGSERIAL vs INT)
- 4C.3: Foreign key validation:
  - List all FK constraints: `information_schema.table_constraints`
  - Verify referential integrity (users.id → orders.user_id, etc.)
  - Test cascading deletes where appropriate
- 4C.4: Constraint validation:
  - Check NOT NULL constraints on critical columns
  - Check UNIQUE constraints (emails, usernames)
  - Check CHECK constraints (status enums, positive amounts)
- 4C.5: Index validation:
  - List all indexes: `pg_indexes`
  - Verify indexes on FK columns
  - Verify indexes on frequently queried columns (created_at, status)
- 4C.6: Migration validation:
  - Query `_sqlx_migrations` table
  - Verify migrations 0001-0010 all applied successfully
  - Check migration checksums match source files
- 4C.7: Data integrity spot checks:
  - Verify test users created in 2B exist
  - Verify no orphaned records (FK violations)
  - Check timestamp columns populated correctly

**Artifacts Produced:**
- `database-verification/schema-report.json` - Complete schema structure
- `database-verification/constraints-report.json` - All constraints validated
- `database-verification/indexes-report.json` - Index coverage analysis
- `database-verification/migrations-report.json` - Applied migration history
- `database-verification/integrity-issues.json` - Data integrity problems found

**Artifacts Consumed:**
- `infrastructure/hetzner-server-info.json` (PostgreSQL connection details)
- API repo migration files (0001-0010) for comparison

**Risk Areas:**
- Uncommitted migrations (0003-0010) may be missing from `_sqlx_migrations` table
- Foreign keys may be missing indexes (performance issue)
- Cascade behavior may not match business logic
- Migration checksums may prevent rollback if needed

---

#### Workstream 4D: Hetzner Connector Lifecycle Testing
**Agent:** voltagent-infra (cloud-architect + devops-engineer roles)  
**Objective:** Test Hetzner connector full lifecycle: connect, provision, status, power actions, reinstall, delete  
**Dependencies:** Must complete after Stage 3 (needs Hetzner connector configured)  
**Can Run in Parallel:** Yes - can run alongside 4A, 4B, 4C

**Subtasks:**
- 4D.1: Test connection validation:
  - Call `/api/admin/hetzner/test-connection`
  - Verify Hetzner API credentials valid
  - Verify SSH key accessible
- 4D.2: Server provision testing:
  - Create test order for CX21 server
  - Call `/api/admin/hetzner/provision` with order ID
  - Monitor provision status (pending → provisioning → active)
  - Verify server appears in Hetzner Cloud dashboard
- 4D.3: Status polling testing:
  - Call `/api/admin/hetzner/servers/{id}/status`
  - Verify status matches Hetzner API response
  - Test status refresh interval
- 4D.4: Power action testing:
  - Power off: `POST /api/admin/hetzner/servers/{id}/power` action=off
  - Verify server stops (status check)
  - Power on: action=on
  - Reboot: action=reboot
- 4D.5: Reinstall testing:
  - Call `/api/admin/hetzner/servers/{id}/reinstall` with new image
  - Verify server rebuilt with Ubuntu 24.04
  - Verify data wiped (destructive test)
- 4D.6: Delete testing:
  - Call `/api/admin/hetzner/servers/{id}/delete`
  - Verify server removed from Hetzner
  - Verify order status updated to "deleted" in database
- 4D.7: Error handling:
  - Test with invalid Hetzner credentials
  - Test provision with insufficient quota
  - Test operations on non-existent server

**Artifacts Produced:**
- `hetzner-testing/connector-lifecycle-report.json` - Full lifecycle test results
- `hetzner-testing/provision-timing.json` - Provision duration metrics
- `hetzner-testing/error-handling-report.json` - Error scenario validation

**Artifacts Consumed:**
- `infrastructure/service-endpoints.txt` (API URL)
- `authentik-config/users.json` (admin1 token for API calls)

**Risk Areas:**
- Hetzner API rate limits may block rapid testing
- Server provision may timeout (can take 60+ seconds)
- Power actions may not propagate immediately (eventual consistency)
- Delete operations may fail if server has active snapshots/volumes
- Webhook callbacks from Hetzner may not reach test server (firewall)

---

### Stage 5: Final Validation & Reporting (Sequential)

#### Workstream 5A: Final Code Review & Security Audit
**Agent:** claude-security (full orchestrator) + voltagent-qa-sec (code-reviewer + security-auditor roles)  
**Objective:** Comprehensive code review of uncommitted API changes and overall security posture  
**Dependencies:** Must complete after Stage 4 (needs all testing complete)  
**Can Run in Parallel:** No

**Subtasks:**
- 5A.1: API uncommitted changes review:
  - Review 47 modified files for security issues
  - Review new routes for proper authentication/authorization
  - Review migrations 0003-0010 for data integrity
  - Review .sqlx directory for query safety (SQL injection)
- 5A.2: Authentication/authorization audit:
  - Review JWT validation implementation
  - Review RBAC middleware implementation
  - Review Authentik integration code
- 5A.3: Input validation audit:
  - Review all API endpoints for input sanitization
  - Review SQL queries for parameterization
  - Review file upload handling if present
- 5A.4: Secrets management audit:
  - Verify no hardcoded credentials
  - Verify .env files not committed
  - Verify Authentik client secrets properly stored
- 5A.5: Dependency audit:
  - Run `npm audit` on storefront and admin
  - Run `cargo audit` on API
  - Review new dependencies in uncommitted changes
- 5A.6: OWASP Top 10 checklist:
  - Injection (SQL, command, LDAP)
  - Broken authentication
  - Sensitive data exposure
  - XML external entities (if XML parsing used)
  - Broken access control
  - Security misconfiguration
  - Cross-site scripting (XSS)
  - Insecure deserialization
  - Using components with known vulnerabilities
  - Insufficient logging and monitoring

**Artifacts Produced:**
- `final-audit/code-review-report.md` - Detailed code review findings
- `final-audit/security-audit-report.md` - Security posture assessment
- `final-audit/dependency-vulnerabilities.json` - npm/cargo audit output
- `final-audit/critical-issues.json` - Must-fix issues before production
- `final-audit/recommendations.md` - Security improvement recommendations

**Artifacts Consumed:**
- All security-results/*.json from 4A
- All rbac-results/*.json from 3C, 3D
- All api-testing/*.json from 4B
- Git diff output from API repo (uncommitted changes)

**Risk Areas:**
- Uncommitted code may contain experimental/debug code not production-ready
- New routes may bypass existing security middleware
- Dependencies may have critical CVEs
- Logging may not capture security events (audit trail gaps)

---

#### Workstream 5B: Report Generation & Cleanup
**Agent:** voltagent-meta (multi-agent-coordinator role) + voltagent-infra (sre-engineer for cleanup)  
**Objective:** Consolidate all test results into comprehensive report and clean up test environment  
**Dependencies:** Must complete after 5A (needs all testing and audits complete)  
**Can Run in Parallel:** No - final sequential step

**Subtasks:**
- 5B.1: Consolidate test results:
  - Parse all JSON reports from previous workstreams
  - Generate summary statistics:
    - Total tests run: unit + E2E + API + security
    - Pass/fail/skip counts
    - Total issues found by severity
    - Coverage metrics if available
- 5B.2: Generate executive summary:
  - Overall QA status (pass/fail/conditional)
  - Critical blocking issues
  - Production readiness assessment
  - Risk mitigation recommendations
- 5B.3: Generate detailed technical report:
  - Section per workstream with results
  - Include screenshots from E2E tests
  - Include code snippets for critical issues
  - Include remediation steps for each issue
- 5B.4: Cleanup test environment:
  - Export final database dump for analysis
  - Export container logs (docker logs)
  - Delete Hetzner test server (save costs)
  - Archive Docker images
  - Clean up test users from Authentik
- 5B.5: Handoff preparation:
  - Tag passing Docker images for production consideration
  - Document environment variables needed for production
  - Document Authentik configuration steps
  - Create deployment runbook

**Artifacts Produced:**
- `final-report/executive-summary.md` - High-level QA results
- `final-report/technical-report.md` - Detailed findings (50+ pages)
- `final-report/test-metrics.json` - Quantitative test data
- `final-report/production-readiness-checklist.md` - Go/no-go criteria
- `final-report/deployment-runbook.md` - Production deployment guide
- `cleanup/database-dump.sql` - Final test database state
- `cleanup/container-logs.tar.gz` - All container logs
- `cleanup/cleanup-confirmation.txt` - Cleanup completed, costs stopped

**Artifacts Consumed:**
- All test-results/*.json
- All e2e-results/*.json
- All rbac-results/*.json
- All security-results/*.json
- All api-testing/*.json
- All database-verification/*.json
- All hetzner-testing/*.json
- All final-audit/*.md and *.json

**Risk Areas:**
- Hetzner server deletion must complete to avoid ongoing costs
- Database dump may contain sensitive test data (sanitize before sharing)
- Container logs may be too large to export efficiently
- Cleanup may accidentally delete production resources if wrong server targeted

---

## Execution Order & Dependencies

### Dependency Graph

```
Start
  |
  v
1A (Unit Tests) - No dependencies, 3 parallel subtasks
  |
  v
1B (Docker Build) - Depends on 1A complete
  |
  v
2A (Hetzner Provision) - Depends on 1B complete
  |
  v
2B (Authentik Config) - Depends on 2A complete
  |
  +----+----+----+
  |    |    |    |
  v    v    v    v
  3A   3B   ---- 4D (can start early, only needs 2B)
  |    |
  |    v
  |    3C
  |    |
  |    v
  |    3D
  |    |
  +----+----+----+
       |    |    |
       v    v    v
       4A   4B   4C (all parallel, depend on Stage 3)
       |    |    |
       +----+----+
            |
            v
           5A (Final Audit) - Depends on all Stage 4
            |
            v
           5B (Report & Cleanup) - Depends on 5A
            |
            v
           End
```

### Sequential Stages

1. **Stage 1 (Foundation)**: 1A → 1B (can parallelize 1A internally)
2. **Stage 2 (Infrastructure)**: 2A → 2B (must be sequential)
3. **Stage 3 (Functional)**: 3A and 3B parallel → 3C → 3D (3A/3B can run together, then 3C/3D sequential)
4. **Stage 4 (Security/API)**: 4A, 4B, 4C, 4D all parallel (4D can start after 2B)
5. **Stage 5 (Final)**: 5A → 5B (must be sequential)

### Parallelization Opportunities

**Maximum Parallelism Points:**
- During 1A: 3 agents testing 3 repos simultaneously
- During Stage 3: 2 agents (3A and 3B) running E2E tests simultaneously
- During Stage 4: 4 agents (4A, 4B, 4C, 4D) running validation simultaneously

**Critical Path:**
The longest sequential dependency chain:
1A (60 min) → 1B (30 min) → 2A (45 min) → 2B (30 min) → 3B (60 min) → 3C (45 min) → 3D (30 min) → 4A (60 min) → 5A (90 min) → 5B (30 min) = **480 minutes (8 hours)**

---

## Shared Artifacts & Handoff Points

### Context Manager Coordination
**Agent:** voltagent-meta (context-manager role)  
**Responsibility:** Maintain shared state file `D:\Projects\Pegasus\VaultScope\qa-state.json` tracking:
- Current stage/workstream status
- Completed workstream checksums
- Infrastructure details (server IP, credentials)
- Test user credentials
- Failure counts per workstream
- Blocking issues requiring human intervention

**Update Frequency:** After each workstream completes

### Critical Handoff Files

| Producer | Consumer | Artifact | Format |
|----------|----------|----------|--------|
| 1A | 1B | `test-results/unit-summary.md` | Markdown |
| 1B | 2A | `docker-images/*.tar` | Docker images |
| 2A | 2B | `infrastructure/service-endpoints.txt` | Plain text |
| 2B | 3A, 3B, 3C, 3D, 4A, 4B, 4D | `authentik-config/users.json` | JSON |
| 2B | 4A | `authentik-config/test-tokens.json` | JSON |
| 3B | 3C | `e2e-results/admin-owner-playwright-report.html` | HTML |
| 3C | 3D | `rbac-results/support-role-report.json` | JSON |
| All Stage 3 | All Stage 4 | All e2e-results/*.json | JSON |
| All Stage 4 | 5A | All security/api/db/hetzner testing results | JSON |
| 5A | 5B | `final-audit/*.md` and `*.json` | Markdown + JSON |
| 5B | Human | `final-report/executive-summary.md` | Markdown |

---

## Risk Areas Requiring Extra Attention

### Critical Risks

1. **API Uncommitted Changes (2,182 insertions)**
   - **Risk Level:** HIGH
   - **Impact:** Changes may break existing functionality, introduce security holes
   - **Mitigation:** Workstream 5A dedicates 90 minutes to thorough code review
   - **Assigned Agent:** claude-security + voltagent-qa-sec (code-reviewer)

2. **Docker Build VITE_* Environment Variables**
   - **Risk Level:** HIGH
   - **Impact:** Frontend apps will have wrong API URLs if not passed to build
   - **Mitigation:** Workstream 1B explicitly documents required --build-arg parameters
   - **Assigned Agent:** voltagent-infra (docker-expert)

3. **Authentik Audience Separation**
   - **Risk Level:** CRITICAL
   - **Impact:** Admin tokens working on storefront = privilege escalation
   - **Mitigation:** Workstream 4A explicitly tests cross-audience JWT rejection
   - **Assigned Agent:** claude-security (penetration-tester)

4. **RBAC Middleware Implementation**
   - **Risk Level:** HIGH
   - **Impact:** Broken RBAC = unauthorized access to admin functions
   - **Mitigation:** Workstream 3C + 3D + 4A comprehensively test all permission boundaries
   - **Assigned Agent:** voltagent-qa-sec (security-auditor)

5. **Rate Limiting on Admin Routes**
   - **Risk Level:** MEDIUM
   - **Impact:** May block legitimate testing or fail to block abuse
   - **Mitigation:** Workstream 4A tests rate limit enforcement and Redis connectivity
   - **Assigned Agent:** claude-security

6. **Hetzner Server Cleanup**
   - **Risk Level:** MEDIUM (financial)
   - **Impact:** Forgetting to delete test server = ongoing costs
   - **Mitigation:** Workstream 5B includes explicit cleanup confirmation
   - **Assigned Agent:** voltagent-infra (sre-engineer)

### Gaps & Uncertainties

1. **No E2E tests exist yet for storefront or admin**
   - **Impact:** Workstream 3A and 3B must write tests from scratch
   - **Recommendation:** Allocate extra time (60 min each instead of 30 min)

2. **Database migration history unclear**
   - **Impact:** Migrations 0003-0010 may depend on each other or have conflicts
   - **Recommendation:** Workstream 4C validates migration order and checksums

3. **Authentik OIDC configuration complexity**
   - **Impact:** Misconfigured OIDC providers break all authentication
   - **Recommendation:** Workstream 2B includes verification steps before proceeding to Stage 3

4. **No existing security testing**
   - **Impact:** Unknown security posture, may discover critical vulnerabilities
   - **Recommendation:** Allocate full 60 minutes to Workstream 4A, include claude-security orchestrator

---

## Agent Assignment Summary

**Total Workstreams:** 14 (1A-1B, 2A-2B, 3A-3D, 4A-4D, 5A-5B)

| Agent | Assigned Workstreams | Primary Roles |
|-------|---------------------|---------------|
| **voltagent-qa-sec** | 1A, 3A, 3B, 3C, 3D (part), 4A (part), 5A (part) | test-automator, ui-ux-tester, security-auditor, code-reviewer |
| **voltagent-core-dev** | 3D (part), 4B | api-designer, backend-developer |
| **voltagent-infra** | 1B, 2A, 2B (part), 4C, 4D, 5B (part) | docker-expert, cloud-architect, database-administrator, sre-engineer |
| **voltagent-meta** | Continuous, 5B (part) | context-manager, multi-agent-coordinator, error-coordinator |
| **claude-security** | 4A (lead), 5A (lead) | Full security orchestrator |

**Unmatched Subtasks:** None - all 14 phases have assigned agents with appropriate capabilities.

---

## Coordination Pattern

**Pattern:** Staged Pipeline with Parallel Fanout

- **Stages 1-2:** Sequential pipeline (each stage feeds next)
- **Stage 3:** Parallel fanout (3A and 3B concurrent) then sequential (3C → 3D)
- **Stage 4:** Maximum parallel fanout (4A, 4B, 4C, 4D all concurrent)
- **Stage 5:** Sequential convergence (5A → 5B)

**Orchestration Mechanism:**
- Human or workflow-orchestrator reads this plan
- Invokes agents in stage order
- Passes artifact files between stages
- voltagent-meta maintains `qa-state.json` for cross-agent coordination

---

## Execution Timeline Estimate

| Stage | Workstreams | Duration | Parallelism |
|-------|-------------|----------|-------------|
| Stage 1 | 1A + 1B | 90 min | 1A parallelized (3 repos), then 1B sequential |
| Stage 2 | 2A + 2B | 75 min | Sequential |
| Stage 3 | 3A-3D | 135 min | 3A/3B parallel (60 min), then 3C (45 min), then 3D (30 min) |
| Stage 4 | 4A-4D | 60 min | All 4 parallel |
| Stage 5 | 5A + 5B | 120 min | Sequential |
| **Total** | **14 workstreams** | **480 min (8 hours)** | Critical path |

**With Perfect Parallelism:** ~8 hours wall-clock time  
**With Sequential Execution:** ~16 hours wall-clock time

---

## Success Criteria

**QA Operation Succeeds If:**
- All 586 unit tests pass (storefront + admin + API)
- All Docker images build successfully with correct env vars
- Hetzner test environment fully provisioned and healthy
- All 6 test users authenticate via Authentik OIDC
- All storefront public routes + forms work (including German locale)
- All 32+ admin routes accessible to Owner role
- RBAC permission matrix validated for Support/Billing/Technical roles
- RBAC escalation flows work (customer → staff → owner)
- All security tests pass (fake JWT rejected, cross-audience blocked, rate limiting enforced)
- All API curl tests pass with proper status codes
- Database schema validated (all tables, PKs, FKs, constraints, indexes, migrations)
- Hetzner connector lifecycle complete (provision → power actions → delete)
- Final code review identifies any critical security issues
- Final security audit confirms production-ready posture
- Comprehensive test report generated
- Test environment cleaned up (Hetzner server deleted, costs stopped)

**Blocking Failures:**
- Cross-audience JWT accepted (admin token works on storefront)
- RBAC allows unauthorized access (e.g., Support sees billing data)
- Rate limiting not enforced (brute force attacks possible)
- Database migrations fail to apply (schema inconsistencies)
- Docker builds fail to include VITE_* env vars (frontend broken)
- Hetzner connector cannot provision servers (core business function)
- Critical CVEs in dependencies (npm audit / cargo audit)

---

## Plan Metadata

**Plan Created:** 2026-09-11  
**Agent Definitions Scanned:** 0 (capabilities provided inline by user)  
**Subtasks Identified:** 14 major workstreams, ~80 discrete subtasks  
**Agents Assigned:** 5 (voltagent-qa-sec, voltagent-core-dev, voltagent-infra, voltagent-meta, claude-security)  
**Unmatched Subtasks:** 0  
**Plan Location:** `D:\Projects\Pegasus\VaultScope\qa-coordination-plan.md`

---

## Next Steps for Orchestrator

1. Read this plan: `D:\Projects\Pegasus\VaultScope\qa-coordination-plan.md`
2. Initialize context manager: spawn voltagent-meta to create `qa-state.json`
3. Execute Stage 1: spawn voltagent-qa-sec for 1A, then voltagent-infra for 1B
4. Monitor `qa-state.json` for stage completion signals
5. Execute Stage 2: spawn voltagent-infra for 2A → 2B
6. Execute Stage 3: spawn voltagent-qa-sec twice (parallel 3A + 3B), then sequential 3C → 3D
7. Execute Stage 4: spawn 4 agents in parallel (claude-security, voltagent-core-dev, voltagent-infra twice)
8. Execute Stage 5: spawn claude-security for 5A, then voltagent-meta + voltagent-infra for 5B
9. Present `final-report/executive-summary.md` to human stakeholder
10. Archive all artifacts to permanent storage

**Human Decision Points:**
- After 1A: If unit tests fail, decide whether to fix before proceeding or continue with known failures
- After 2A: If Hetzner provisioning fails, decide whether to use alternative hosting or retry
- After 4A: If critical security issues found, decide whether to halt QA or continue with documented risks
- After 5A: If code review identifies blocker issues, decide whether to fix and re-test or document for later
- After 5B: Go/no-go decision for production deployment based on final report

---

## Notes for Agent Invocation

**For voltagent-qa-sec:**
- Install Playwright if not present: `npx playwright install`
- Use `--headed` mode for debugging E2E test failures
- Capture screenshots on failure: `page.screenshot({ path: 'failure.png' })`
- For 3C/3D: Read `authentik-config/users.json` to get role-specific credentials

**For voltagent-infra:**
- Store Hetzner API token securely (read from environment variable)
- Use absolute paths for all Docker-related operations
- For 2A: Ensure `docker-compose.yml` includes health checks for all services
- For 4C: Use PostgreSQL connection from `infrastructure/hetzner-server-info.json`

**For voltagent-core-dev:**
- For 4B: Use `curl -v` to capture full HTTP exchange for debugging
- Store JWT tokens in variables: `TOKEN=$(cat authentik-config/test-tokens.json | jq -r .admin1)`
- Test both success and failure cases for each endpoint

**For claude-security:**
- For 4A: Use tools like `jwt.io` to craft malicious tokens
- Test rate limiting by scripting rapid requests (e.g., `for i in {1..150}; do curl ...; done`)
- For 5A: Focus code review on new routes and migrations (uncommitted changes)

**For voltagent-meta:**
- Update `qa-state.json` after each workstream with: `{ "workstream": "3A", "status": "complete", "timestamp": "...", "artifacts": [...] }`
- If any workstream fails, set `status: "blocked"` and halt downstream dependencies
- Coordinate error handling: if 3 consecutive workstreams fail, escalate to human
