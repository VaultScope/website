export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export interface DocArticle {
  id: string;
  title: string;
  category: 'Overview' | 'Customer Guides' | 'Storefront' | 'VAMOS Backend' | 'CAMOS Admin' | 'Guides & Architecture';
  path: string;
  description: string;
  keywords: string[];
  sections: DocSection[];
}

export const DOCS_INDEX: DocArticle[] = [
  {
    id: 'customer-getting-started',
    title: 'Getting Started & Account Security',
    category: 'Customer Guides',
    path: '/docs/customer/getting-started',
    description: 'Account registration, email verification, 2FA/TOTP authenticator setup, security best practices, and GDPR compliance.',
    keywords: ['getting started', '2fa', 'mfa', 'totp', 'security', 'authenticator', 'backup codes', 'email verification', 'gdpr', 'data sovereignty'],
    sections: [
      { id: 'account-creation', title: 'Account Registration', content: 'Frictionless onboarding, organization details, Argon2id salted password hashing.' },
      { id: 'email-verification', title: 'Email Verification', content: 'Cryptographically signed email verification links dispatched on signup.' },
      { id: 'totp-mfa', title: 'Two-Factor Authentication (2FA)', content: 'RFC 6238 TOTP seed generation, Google Authenticator, Bitwarden, 8 single-use emergency backup recovery codes.' },
      { id: 'security-best-practices', title: 'Security Best Practices', content: 'Enforcing SSH key-only authentication, scoped sub-accounts, audit log telemetry.' },
      { id: 'data-sovereignty', title: 'GDPR & Data Sovereignty', content: 'German ISO 27001 datacenters in Nuremberg and Falkenstein, zero US CLOUD Act exposure.' }
    ]
  },
  {
    id: 'customer-vps',
    title: 'Cloud VPS Management Guide',
    category: 'Customer Guides',
    path: '/docs/customer/vps',
    description: 'Connecting via SSH keys, power controls, interactive in-browser noVNC console with clipboard text pasting, OS reinstallation, and rescue mode.',
    keywords: ['vps', 'cloud', 'ssh', 'ed25519', 'power', 'reboot', 'novnc', 'console', 'reinstall', 'rescue', 'ptr', 'reverse dns'],
    sections: [
      { id: 'connecting-ssh', title: 'Connecting via SSH & Keys', content: 'Generating Ed25519 elliptic-curve keys, configuring ~/.ssh/config, hardened SSH daemon.' },
      { id: 'power-management', title: 'Power & Lifecycle States', content: 'Soft Reboot ACPI, Graceful Shutdown, Force Stop power cut, Hardware Reset.' },
      { id: 'web-console', title: 'Interactive In-Browser noVNC Console', content: 'Virtual key bar Ctrl+Alt+Del, clipboard injection drawer, real-time latency ping telemetry.' },
      { id: 'os-reinstall', title: 'Operating System Reinstall', content: 'Pristine distribution rebuilds: Ubuntu 24.04, Debian 12, AlmaLinux 9, Alpine 3.20.' },
      { id: 'rescue-mode', title: 'Rescue Environment & Recovery', content: 'Booting Debian RAM disk rescue environment, chrooting root filesystem, password recovery.' },
      { id: 'networking', title: 'Reverse DNS (PTR) & Network Setup', content: 'Configuring FQDN PTR records for SMTP mail servers and forward DNS parity.' }
    ]
  },
  {
    id: 'customer-sftp',
    title: 'Sovereign SFTP Storage Guide',
    category: 'Customer Guides',
    path: '/docs/customer/sftp',
    description: 'Connection parameters, FileZilla setup, Cyberduck/Mountain Duck configuration, WinSCP, and automated backup sync with rclone.',
    keywords: ['sftp', 'storage', 'filezilla', 'cyberduck', 'winscp', 'rclone', 'backups', 'port 2222', 'ceph', 'sub-accounts', 'acl', 'quotas'],
    sections: [
      { id: 'connection-parameters', title: 'Connection Credentials', content: 'sftp.vaultscope.de, Port 2222, password and Ed25519 public key authentication.' },
      { id: 'filezilla-guide', title: 'FileZilla Setup Guide', content: 'Site Manager configuration, SFTP protocol, Port 2222, concurrent connection limits.' },
      { id: 'cyberduck-guide', title: 'Cyberduck & Mountain Duck', content: 'Mounting SFTP storage as local drive on macOS Finder and Windows Explorer.' },
      { id: 'winscp-guide', title: 'WinSCP Setup', content: 'Windows enterprise SFTP configuration and Pageant SSH agent authentication.' },
      { id: 'rclone-automation', title: 'Automated Backups with Rclone', content: 'rclone.conf configuration, 8 parallel transfers, cron automated sync scripts.' },
      { id: 'sub-accounts-acls', title: 'Sub-Accounts & Directory ACLs', content: 'Chroot scoped root paths, read-only and write-only append dropboxes, storage quotas.' }
    ]
  },
  {
    id: 'customer-dedicated',
    title: 'Dedicated Bare-Metal Servers Guide',
    category: 'Customer Guides',
    path: '/docs/customer/dedicated',
    description: 'Single-tenant bare-metal architecture, out-of-band IPMI/KVM HTML5 access, automated PXE unattended OS reinstall, and hardware diagnostics.',
    keywords: ['dedicated', 'bare metal', 'ipmi', 'kvm', 'pxe', 'reinstall', 'pdu', 'smartctl', 'uplink', 'vswitch', 'vlan', 'ecc ram', 'epyc'],
    sections: [
      { id: 'hardware-specs', title: 'Bare-Metal Architecture', content: 'AMD EPYC, Intel Xeon Scalable, ECC memory, datacenter NVMe PCIe Gen4/Gen5 RAID arrays.' },
      { id: 'ipmi-kvm', title: 'Out-of-Band IPMI / KVM Access', content: 'HTML5 remote console sessions, BIOS access, virtual media remote ISO mounting.' },
      { id: 'automated-pxe', title: 'Automated PXE Reinstallation', content: 'Automated unattended re-imaging in 8-15 minutes, Ubuntu, Debian, Proxmox VE, AlmaLinux.' },
      { id: 'power-cycles', title: 'Hardware Power & PDU Control', content: 'Chassis IPMI power commands and switched PDU cold electrical power cycling.' },
      { id: 'hardware-diagnostics', title: 'Diagnostics & Rescue System', content: 'smartctl NVMe attributes, CPU temperature telemetry, EDAC RAM memory errors.' },
      { id: 'network-uplinks', title: 'Uplinks, VLANs & Secondary IPs', content: '1 Gbps / 10 Gbps unmetered uplinks, routed /64 IPv6 subnets, vSwitch private VLANs.' }
    ]
  },
  {
    id: 'customer-billing',
    title: 'Billing, VAT & GoBD Invoices Guide',
    category: 'Customer Guides',
    path: '/docs/customer/billing',
    description: 'GoBD German tax compliance, DIN 5008 invoice layout, 19% VAT and EU B2B reverse charge, downloading vector PDF invoices, and automated accounting CC.',
    keywords: ['billing', 'invoices', 'pdf', 'gobd', 'vat', 'ust', 'mwst', 'reverse charge', 'vies', 'stripe', 'sepa', 'accounting', 'din 5008'],
    sections: [
      { id: 'gobd-compliance', title: 'GoBD & DIN 5008 Compliance', content: 'Immutable invoice numbers VS-INV-YYYY-XXXXX, SHA-256 audit hashes, 10-year archival.' },
      { id: 'vat-taxation', title: '19% VAT & EU Reverse Charge', content: 'German 19% MwSt., EU B2B 0% reverse charge with VIES validation, non-EU export.' },
      { id: 'pdf-invoices', title: 'Downloading Vector PDF Invoices', content: 'DIN 5008 vector PDF, itemized service breakdowns, tax registration and SEPA details.' },
      { id: 'payment-methods', title: 'Payment Methods & Cycles', content: 'Credit cards via Stripe Elements, SEPA Direct Debit, bank wire transfers.' },
      { id: 'accounting-cc', title: 'Automated Accounting Email CC', content: 'Automatic PDF invoice forwarding to accounting@yourcompany.de or tax advisor.' },
      { id: 'cancellation-terms', title: 'Cancellation & Prorated Billing', content: 'Monthly flexible cancellation, 7-day failed charge grace period.' }
    ]
  },
  {
    id: 'customer-support',
    title: 'Support Desk & SLAs Guide',
    category: 'Customer Guides',
    path: '/docs/customer/support',
    description: 'Opening tickets, priority severity response SLAs, real-time message streaming, diagnostic attachments up to 10MB, and email response alerts.',
    keywords: ['support', 'tickets', 'sla', 'priority', 'critical', 'p1', 'realtime', 'attachments', '10mb', 'images', 'smtp', 'alerts'],
    sections: [
      { id: 'submitting-tickets', title: 'Opening a Support Ticket', content: 'In-house Linux kernel engineers and system administrators, linking affected service IDs.' },
      { id: 'priority-slas', title: 'Priority Levels & Response SLAs', content: 'P1 Critical under 15m (24/7), P2 High under 1h, P3 Normal under 4h, P4 Low under 12h.' },
      { id: 'realtime-updates', title: 'Real-Time Messaging & Updates', content: 'Live streaming updates without page reloads, real-time ticket status indicators.' },
      { id: 'file-attachments', title: 'Diagnostic File Attachments (10MB)', content: 'Maximum 10MB per attachment, image formats PNG, JPEG, WebP, GIF for security.' },
      { id: 'smtp-alerts', title: 'Automated Email Notifications', content: 'Instant email delivery with full response body and ticket deep link.' },
      { id: 'outage-escalation', title: 'Emergency Production Escalation', content: 'Critical P1 automated PagerDuty engineer alerting and status.vaultscope.de portal.' }
    ]
  },
  {
    id: 'overview',
    title: 'VaultScope Documentation Overview',
    category: 'Overview',
    path: '/docs',
    description: 'Central portal covering the VaultScope ecosystem, customer storefront, VAMOS API, and CAMOS admin panel.',
    keywords: ['overview', 'ecosystem', 'introduction', 'welcome', 'architecture', 'projects', 'modules', 'portal'],
    sections: [
      { id: 'customer-guides', title: 'Customer Knowledge Base', content: 'Guides for VPS management, SFTP storage, Dedicated servers, GoBD billing, and Support desk.' },
      { id: 'platform', title: 'Platform Architecture & Operations', content: 'Decoupled systems with customer storefront, VAMOS Rust API, and CAMOS admin portal.' },
      { id: 'security', title: 'Security First Approach', content: 'Zero-trust architecture, AES-256-GCM encryption for cloud provider API tokens, strict PKCE OIDC authorization.' },
      { id: 'projects', title: 'Core Projects & Services', content: 'Customer Storefront, VAMOS Backend API, CAMOS Admin Panel.' }
    ]
  },
  {
    id: 'architecture',
    title: 'System Architecture & Data Flow',
    category: 'Guides & Architecture',
    path: '/docs/architecture',
    description: 'Multi-tier decoupled topology, inter-service REST communication, async Tokio worker daemons, and cloud connectors.',
    keywords: ['architecture', 'data flow', 'topology', 'tokio', 'jobrunner', 'hetzner', 'redis', 'postgres', 'tiers', 'provisioning lifecycle'],
    sections: [
      { id: 'overview', title: 'Ecosystem Architecture', content: 'Decoupled multi-tier hosting automation: Client Tier, Central Brain Axum API, State Tier Postgres & Redis, Orchestration Tier JobRunner.' },
      { id: 'components', title: 'System Components', content: 'Storefront Caddy port 8080, CAMOS Nginx port 8081, VAMOS port 3000, PostgreSQL port 5432, Redis port 6379.' },
      { id: 'data-flow', title: 'Provisioning Lifecycle Flow', content: 'Order creation in Storefront, invoice generation, payment confirmation, Tokio worker execution, Hetzner API call.' },
      { id: 'security-boundaries', title: 'Security Boundaries', content: 'Zero direct DB access, encrypted secret store AES-256-GCM, separation of staff and customer contexts.' },
      { id: 'network-topology', title: 'Network & Port Topology', content: 'Internal bridge network, reverse proxy Caddy HTTPS port 443, VAMOS port 3000.' }
    ]
  },
  {
    id: 'authentik',
    title: 'Authentik OIDC Single Sign-On Guide',
    category: 'Guides & Architecture',
    path: '/docs/authentik',
    description: 'Step-by-step identity federation setup with Authentik, OAuth2 Authorization Code Flow with PKCE, and staff RBAC mapping.',
    keywords: ['authentik', 'oidc', 'sso', 'oauth2', 'pkce', 'jwks', 'jwt', 'tokens', 'rbac', 'mfa', 'groups', 'vaultscope-admin'],
    sections: [
      { id: 'overview', title: 'Identity Architecture', content: 'Centralized identity management with WebAuthn TOTP MFA and federated Single Sign-On via PKCE.' },
      { id: 'create-provider', title: 'Create OAuth2 Provider', content: 'Client Type Public, default-authorization-flow, scopes openid profile email groups.' },
      { id: 'create-apps', title: 'Register Applications', content: 'Storefront app slug vaultscope-storefront, CAMOS admin app slug vaultscope-camos.' },
      { id: 'redirect-uris', title: 'Configure Redirect URIs', content: 'Callback URLs for storefront https://vaultscope.de/auth/callback and admin https://admin.vaultscope.de/callback.' },
      { id: 'rbac-groups', title: 'Staff Group & Scope Mapping', content: 'vaultscope-admin group creation and ak_groups property mapping in Authentik.' },
      { id: 'backend-config', title: 'VAMOS Token Verification', content: 'AUTHENTIK_ISSUER_URL and JWKS public key downloading in Axum API.' }
    ]
  },
  {
    id: 'api-reference',
    title: 'VAMOS REST API Reference',
    category: 'Guides & Architecture',
    path: '/docs/api',
    description: 'Technical reference for VAMOS REST endpoints, authentication protocols, rate limiting behavior, and error representations.',
    keywords: ['api', 'rest', 'endpoints', 'reference', 'swagger', 'orders', 'services', 'catalog', 'billing', 'invoices', 'ratelimit', 'tickets'],
    sections: [
      { id: 'overview', title: 'API Conventions', content: 'Base URL https://api.vaultscope.de/api, JSON payloads, ISO 8601 timestamps.' },
      { id: 'auth-headers', title: 'Authentication', content: 'Authorization Bearer Authentik access token.' },
      { id: 'rate-limits', title: 'Rate Limiting', content: 'Redis token bucket algorithm, X-RateLimit-Limit, X-RateLimit-Remaining, HTTP 429.' },
      { id: 'storefront-api', title: 'Storefront Endpoints', content: 'GET /api/v1/catalog/products, POST /api/v1/orders, GET /api/v1/services, POST /api/v1/services/:id/reboot, GET /api/v1/invoices.' },
      { id: 'admin-api', title: 'Admin Endpoints', content: 'GET /api/v1/admin/dashboard, GET /api/v1/admin/jobs, POST /api/v1/admin/jobs/:id/retry, GET /api/v1/admin/connectors.' },
      { id: 'errors', title: 'Error Representation', content: 'Structured error objects with error, code, and details.' }
    ]
  },
  {
    id: 'runbooks',
    title: 'Production Operations Runbooks',
    category: 'Guides & Architecture',
    path: '/docs/runbooks',
    description: 'Standard operating procedures, PostgreSQL custom dumps, job queue troubleshooting, ACME TLS triage, and SRE incident checklists.',
    keywords: ['runbooks', 'operations', 'backup', 'restore', 'pg_dump', 'cron', 'jobs', 'triage', 'ssl', 'caddy', 'acme', 'journalctl', 'incident'],
    sections: [
      { id: 'cron-backups', title: 'Automated Database Backups', content: 'Nightly bash script with pg_dump -Fc custom format and 14 day retention rotation.' },
      { id: 'job-triage', title: 'Job Queue Triage', content: 'Diagnosing failed provisioning tasks and re-queueing jobs in PostgreSQL with status queued.' },
      { id: 'ssl-certificates', title: 'SSL / ACME Triage', content: 'Troubleshooting Caddy Let\'s Encrypt certificates, DNS propagation, and port 80/443 firewalls.' },
      { id: 'log-inspection', title: 'Telemetry & Log Inspection', content: 'Querying VAMOS logs via journalctl -u vamos -f and filtering error traces.' },
      { id: 'incident-checklist', title: 'Incident Response Checklist', content: 'P1 outage triage: process status, database connection limits, Redis memory, disk space.' }
    ]
  },
  {
    id: 'storefront-overview',
    title: 'Storefront Overview',
    category: 'Storefront',
    path: '/docs/projects/storefront',
    description: 'Customer-facing web application built with React 19, Vite 8, Tailwind CSS 4, and served in production by Caddy.',
    keywords: ['storefront', 'customer experience', 'react 19', 'vite', 'caddy', 'tailwind', 'catalog', 'ordering', 'customer portal'],
    sections: [
      { id: 'overview', title: 'Ecosystem Role', content: 'Public storefront and authenticated customer portal communicating with VAMOS REST API.' },
      { id: 'capabilities', title: 'Core Capabilities', content: 'Dynamic Product Catalog, Automated Ordering Workflow, Customer Infrastructure Console, Authentik OIDC.' },
      { id: 'tech-stack', title: 'Technology Stack', content: 'React 19 SPA, Vite 8 bundler, Tailwind v4, Caddy 2 reverse proxy.' },
      { id: 'prerequisites', title: 'Host Requirements', content: 'Ubuntu 22.04 or Debian 12, 1 vCPU, 512MB RAM, ports 80 and 443.' }
    ]
  },
  {
    id: 'storefront-install',
    title: 'Storefront Installation',
    category: 'Storefront',
    path: '/docs/projects/storefront/install',
    description: 'Deployment guides for the customer storefront: automated shell installer, Docker container with Caddy, or local development.',
    keywords: ['storefront installation', 'docker', 'installer.sh', 'caddy', 'deploy', 'npm install', 'caddyfile'],
    sections: [
      { id: 'quickstart', title: 'Automated Quickstart', content: 'curl installer.sh pipe to bash on Ubuntu and Debian hosts.' },
      { id: 'docker', title: 'Production Docker Setup', content: 'Multi-stage Dockerfile with Node 20 builder and Caddy Alpine server, passing VITE_ build arguments.' },
      { id: 'local-dev', title: 'Local Development', content: 'git clone, npm install, .env file, npm run dev Vite HMR server on port 5173.' },
      { id: 'systemd', title: 'Bare-Metal Caddy Configuration', content: 'Caddyfile config with gzip, zstd, try_files SPA fallback, and security headers.' }
    ]
  },
  {
    id: 'storefront-config',
    title: 'Storefront Configuration',
    category: 'Storefront',
    path: '/docs/projects/storefront/config',
    description: 'Environment variables matrix, Vite build-time parameters, German locale routing rules, and HTTP security headers.',
    keywords: ['storefront config', 'vite_api_url', 'vite_authentik_url', 'vite_oidc_client_id', 'i18n', 'environment variables', 'stripe'],
    sections: [
      { id: 'env-matrix', title: 'Environment Variables', content: 'VITE_API_URL, VITE_AUTHENTIK_URL, VITE_OIDC_CLIENT_ID, VITE_OIDC_REDIRECT_URI, VITE_STRIPE_PUBLISHABLE_KEY.' },
      { id: 'build-mechanics', title: 'Vite Build Mechanics', content: 'Build-time variable replacement in client bundles vs runtime containers.' },
      { id: 'i18n-routing', title: 'i18n & German Locale Routing', content: 'German /de/ URL prefix routing, LocaleLink navigation component.' },
      { id: 'security-headers', title: 'Caddy Security Headers', content: 'X-Frame-Options DENY, X-Content-Type-Options nosniff, HSTS, Referrer-Policy.' }
    ]
  },
  {
    id: 'storefront-lifecycle',
    title: 'Storefront Lifecycle & Maintenance',
    category: 'Storefront',
    path: '/docs/projects/storefront/lifecycle',
    description: 'Procedures for zero-downtime container upgrades, asset cache invalidation, config backups, rollback, and uninstallation.',
    keywords: ['storefront updates', 'upgrades', 'zero downtime', 'blue green', 'caddy reload', 'rollback', 'uninstallation'],
    sections: [
      { id: 'upgrades', title: 'Upgrading Storefront', content: 'Pulling git tags, rebuilding Docker image, swapping container instances.' },
      { id: 'zero-downtime', title: 'Zero-Downtime Releases', content: 'Caddy reload without dropping connections, blue-green deployment.' },
      { id: 'backups', title: 'Backup Procedures', content: 'Archiving .env, Caddyfile, and Let\'s Encrypt certificates in /data/caddy.' },
      { id: 'uninstallation', title: 'Clean Uninstallation', content: 'Stopping Docker container, removing Caddy configs, clean purge.' }
    ]
  },
  {
    id: 'vamos-overview',
    title: 'VAMOS Backend Overview',
    category: 'VAMOS Backend',
    path: '/docs/projects/vamos',
    description: 'High-performance asynchronous backend and orchestration engine written in Rust using Axum, Tokio, SQLx, and PostgreSQL.',
    keywords: ['vamos', 'rust', 'backend', 'axum', 'tokio', 'sqlx', 'engine', 'jobrunner', 'connectors', 'postgres'],
    sections: [
      { id: 'overview', title: 'Ecosystem Role', content: 'Central brain of VaultScope handling catalog, billing, provisioning, and cloud integrations.' },
      { id: 'architecture', title: 'Core Capabilities', content: 'Centralized API Gateway, Asynchronous Job Runner, Infrastructure Connectors, Zero-Trust Credential Security.' },
      { id: 'crates', title: 'Cargo Workspace Architecture', content: 'vamos-api, vamos-jobs, vamos-connectors, vamos-db, vamos-common.' },
      { id: 'prerequisites', title: 'Host Requirements', content: 'PostgreSQL 16, Redis 7, 1 vCPU, 1 GB RAM minimum, Ubuntu 22.04 or Debian 12.' }
    ]
  },
  {
    id: 'vamos-install',
    title: 'VAMOS Installation',
    category: 'VAMOS Backend',
    path: '/docs/projects/vamos/install',
    description: 'Instructions for provisioning VAMOS API, PostgreSQL database, Redis cache, and Tokio background worker daemon.',
    keywords: ['vamos installation', 'cargo build', 'docker-compose', 'systemd', 'sqlx migrate', 'postgres', 'redis'],
    sections: [
      { id: 'quickstart', title: 'Automated Quickstart', content: 'Unified installer script setting up PostgreSQL 16 and VAMOS daemon.' },
      { id: 'docker-compose', title: 'Docker Compose Stack', content: 'Multi-container compose file running PostgreSQL, Redis, and VAMOS API on port 3000.' },
      { id: 'cargo-build', title: 'Local Cargo Compilation', content: 'Rust 1.78+ toolchain, cargo build --release --bin vamos-api, and sqlx migrate run.' },
      { id: 'systemd', title: 'Systemd Production Service', content: 'vamos.service unit file with auto-restart, NoNewPrivileges, and journal logging.' },
      { id: 'verification', title: 'Health Verification', content: 'curl http://localhost:3000/api/health returning status healthy.' }
    ]
  },
  {
    id: 'vamos-config',
    title: 'VAMOS Configuration',
    category: 'VAMOS Backend',
    path: '/docs/projects/vamos/config',
    description: 'Configuration matrix for database pooling, AES-256-GCM encryption secrets, Authentik OIDC validation, and worker queues.',
    keywords: ['vamos config', 'database_url', 'redis_url', 'jwt_secret', 'encryption_key', 'aes-256-gcm', 'authentik_issuer_url', 'concurrency'],
    sections: [
      { id: 'env-matrix', title: 'Configuration Matrix', content: 'DATABASE_URL, REDIS_URL, JWT_SECRET, ENCRYPTION_KEY, AUTHENTIK_ISSUER_URL, JOB_WORKER_CONCURRENCY.' },
      { id: 'secrets-security', title: 'Secret Key Management', content: 'Generating 64-byte JWT secret and 32-byte AES-256-GCM encryption key via openssl rand -base64.' },
      { id: 'db-tuning', title: 'Database Connection Pool Tuning', content: 'SQLx pool sizing: DB_MAX_CONNECTIONS set to 70% of postgres max_connections.' },
      { id: 'job-queues', title: 'Job Worker Concurrency', content: 'Controlling parallel provisioning tasks across worker threads.' }
    ]
  },
  {
    id: 'vamos-lifecycle',
    title: 'VAMOS Lifecycle & Migrations',
    category: 'VAMOS Backend',
    path: '/docs/projects/vamos/lifecycle',
    description: 'Operational workflows for running SQLx schema migrations, applying binary updates, PostgreSQL backups, and disaster restore.',
    keywords: ['vamos lifecycle', 'sqlx migrations', 'pg_dump', 'pg_restore', 'database backup', 'upgrades', 'disaster recovery'],
    sections: [
      { id: 'upgrades', title: 'Upgrading VAMOS', content: 'Checking active jobs, pulling release tags, recompiling or restarting Docker container.' },
      { id: 'migrations', title: 'SQLx Database Migrations', content: 'sqlx migrate info, sqlx migrate run, emergency sqlx migrate revert.' },
      { id: 'backups', title: 'PostgreSQL Database Backups', content: 'Creating compressed custom-format pg_dump -Fc backups.' },
      { id: 'restore', title: 'Disaster Recovery & Restore', content: 'Stopping daemon, terminating DB connections, pg_restore --clean.' },
      { id: 'uninstallation', title: 'Clean Uninstallation', content: 'Stopping systemd service, dropdb, and removing binaries.' }
    ]
  },
  {
    id: 'camos-overview',
    title: 'CAMOS Admin Panel Overview',
    category: 'CAMOS Admin',
    path: '/docs/projects/camos',
    description: 'Internal control plane empowering operators and staff to govern infrastructure connectors, job queues, and billing.',
    keywords: ['camos', 'admin panel', 'control plane', 'staff', 'internal', 'connectors', 'hetzner cloud', 'support tickets', 'rbac'],
    sections: [
      { id: 'overview', title: 'Ecosystem Role', content: 'Internal control plane for VaultScope operators, requiring Authentik vaultscope-admin group credentials.' },
      { id: 'capabilities', title: 'Core Capabilities', content: 'Product & Catalog Management, Job Queue Inspection & Retry, Customer 360, Cloud Connectors Dashboard.' },
      { id: 'tech-stack', title: 'Technology Stack', content: 'React 19, Recharts telemetry, TipTap rich-text editor, Nginx Alpine web server.' },
      { id: 'security', title: 'Security & Access Control', content: 'Network layer restrictions, IP allowlisting, Tailscale / WireGuard VPN access.' }
    ]
  },
  {
    id: 'camos-install',
    title: 'CAMOS Installation',
    category: 'CAMOS Admin',
    path: '/docs/projects/camos/install',
    description: 'Deployment guides for CAMOS admin panel using Docker container with Nginx, automated script, or local dev server.',
    keywords: ['camos installation', 'docker', 'nginx', 'virtual host', 'ip allowlist', 'admin deploy'],
    sections: [
      { id: 'quickstart', title: 'Automated Quickstart', content: 'Automated script deploying CAMOS alongside VAMOS and Storefront.' },
      { id: 'docker', title: 'Docker Container Setup', content: 'Nginx Alpine image bound to 127.0.0.1:8081 for reverse proxy routing.' },
      { id: 'local-dev', title: 'Local Development', content: 'npm install, cp .env.example .env, npm run dev.' },
      { id: 'nginx', title: 'Nginx Virtual Host with Network Restrictions', content: 'Allowlisting office or VPN subnets (allow 10.0.0.0/8, deny all).' }
    ]
  },
  {
    id: 'camos-config',
    title: 'CAMOS Configuration',
    category: 'CAMOS Admin',
    path: '/docs/projects/camos/config',
    description: 'Reference for CAMOS environment flags, Authentik administrator client configuration, and role-based access control.',
    keywords: ['camos config', 'vite_api_url', 'vite_authentik_url', 'vaultscope-admin', 'rbac', 'session timeout'],
    sections: [
      { id: 'env-matrix', title: 'Environment Variables', content: 'VITE_API_URL, VITE_AUTHENTIK_URL, VITE_OIDC_CLIENT_ID, VITE_OIDC_REDIRECT_URI.' },
      { id: 'authentik-client', title: 'Authentik Admin Client Setup', content: 'Public client with PKCE, redirect URI https://admin.vaultscope.de/callback, groups scope.' },
      { id: 'rbac-roles', title: 'RBAC & Group Membership', content: 'Token validation checking for vaultscope-admin in Authentik claims.' },
      { id: 'session-timeout', title: 'Staff Inactivity Timeout', content: 'Automatic session invalidation after 30 minutes of idle time.' }
    ]
  },
  {
    id: 'camos-lifecycle',
    title: 'CAMOS Lifecycle & Upgrades',
    category: 'CAMOS Admin',
    path: '/docs/projects/camos/lifecycle',
    description: 'Procedures for updating the CAMOS administrative portal, clearing frontend caches, configuration backups, and service removal.',
    keywords: ['camos lifecycle', 'upgrades', 'cache invalidation', 'index.html cache-control', 'backups', 'uninstall'],
    sections: [
      { id: 'upgrades', title: 'Upgrading CAMOS', content: 'Pulling release tags, rebuilding Docker image, swapping container on port 8081.' },
      { id: 'cache', title: 'Static Cache Invalidation', content: 'Serving index.html with Cache-Control no-cache, no-store, must-revalidate.' },
      { id: 'backups', title: 'Backups', content: 'Archiving .env and Nginx sites-available configs.' },
      { id: 'uninstallation', title: 'Clean Uninstallation', content: 'Stopping container, removing Nginx site, deleting source.' }
    ]
  }
];

export interface SearchMatch {
  article: DocArticle;
  matchedSection?: DocSection;
  matchedField: 'title' | 'description' | 'section-title' | 'section-content' | 'keyword';
  matchSnippet: string;
  score: number;
}

export function searchDocs(query: string): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const results: SearchMatch[] = [];

  for (const article of DOCS_INDEX) {
    let highestScore = 0;
    let bestSection: DocSection | undefined;
    let matchedField: SearchMatch['matchedField'] = 'title';
    let snippet = article.description;

    const titleLower = article.title.toLowerCase();
    const descLower = article.description.toLowerCase();

    // Check title match
    if (terms.every(t => titleLower.includes(t))) {
      highestScore += 100;
      matchedField = 'title';
      snippet = article.description;
    } else if (terms.some(t => titleLower.includes(t))) {
      highestScore += 50;
      matchedField = 'title';
      snippet = article.description;
    }

    // Check keywords
    const matchedKw = article.keywords.filter(k => terms.some(t => k.includes(t)));
    if (matchedKw.length > 0) {
      highestScore += 30 * matchedKw.length;
      if (highestScore < 100) {
        matchedField = 'keyword';
        snippet = `Matches tags: ${matchedKw.join(', ')}`;
      }
    }

    // Check description
    if (terms.some(t => descLower.includes(t))) {
      highestScore += 25;
      if (highestScore < 80) {
        matchedField = 'description';
        snippet = article.description;
      }
    }

    // Check sections
    for (const sec of article.sections) {
      const secTitleLower = sec.title.toLowerCase();
      const secContentLower = sec.content.toLowerCase();

      if (terms.some(t => secTitleLower.includes(t))) {
        highestScore += 40;
        bestSection = sec;
        matchedField = 'section-title';
        snippet = sec.content;
      } else if (terms.some(t => secContentLower.includes(t))) {
        highestScore += 20;
        if (!bestSection) {
          bestSection = sec;
          matchedField = 'section-content';
          snippet = sec.content;
        }
      }
    }

    if (highestScore > 0) {
      results.push({
        article,
        matchedSection: bestSection,
        matchedField,
        matchSnippet: snippet,
        score: highestScore
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
