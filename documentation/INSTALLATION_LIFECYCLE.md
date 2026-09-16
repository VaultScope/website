# VaultScope Storefront — Lifecycle Guide
## Installation, Upgrading, and Uninstallation

This document provides complete instructions for installing, upgrading, and uninstalling the VaultScope Storefront, the customer-facing web application of the VaultScope ecosystem.

---

## 1. Overview & Architecture

The VaultScope Storefront is a customer-facing single page application (SPA) built with:
- **React 19 & Vite 8**: Component rendering and bundle compilation
- **Tailwind CSS 4**: Styling with utility classes and CSS variables
- **Three.js & Lucide**: 3D interactive graphics and iconography
- **Stripe Elements**: Dynamic checkout and card payments
- **Caddy 2 Alpine**: High-performance HTTP server with automatic gzip compression and SPA fallback (`try_files {path} /index.html`)

### Default Ports & Networking
- **Internal Container Port**: `3000`
- **Host Port**: `8080` (production stack) or `3000` (full-stack dev)
- **Health Check**: `GET http://localhost:3000`

---

## 2. Prerequisites & System Requirements

### Production Requirements
- **OS**: Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+, RHEL 8+)
- **Docker**: Version 24+ & Docker Compose v2
- **VAMOS API**: Running backend API instance (`https://api.your-domain.com/api`)
- **Authentik**: OIDC provider with client ID `vaultscope-storefront`

### Bare-Metal Development Requirements
- **Node.js**: 22.x or higher
- **npm**: 10.x or higher

---

## 3. Installation Methods

### Method A: Automated Full-Stack Installation (Production)
```bash
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash
```
The installer automatically:
1. Clones Storefront into `/opt/vaultscope/website`.
2. Bakes build-time environment variables (`VITE_*`) into the bundle.
3. Sets up Caddy inside Docker and Nginx reverse proxy with Let's Encrypt SSL.
4. Starts the `vaultscope-storefront` container.

---

### Method B: Standalone Docker Container Deployment
```bash
# 1. Clone repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Build Docker container with build arguments
docker build -t vaultscope-storefront \
  --build-arg VITE_API_URL=https://api.your-domain.com/api \
  --build-arg VITE_AUTHENTIK_URL=https://auth.your-domain.com \
  --build-arg VITE_OIDC_CLIENT_ID=vaultscope-storefront \
  --build-arg VITE_OIDC_REDIRECT_URI=https://your-domain.com/auth/callback .

# 3. Run container
docker run -d \
  --name vaultscope-storefront \
  --restart unless-stopped \
  -p 8080:3000 \
  vaultscope-storefront
```

---

### Method C: Bare-Metal Local Development
```bash
# 1. Clone repository
git clone https://github.com/VaultScope/website.git
cd website

# 2. Install dependencies
npm install

# 3. Configure environment file
cp .env.example .env
nano .env

# 4. Start Vite development server
npm run dev
# The storefront will be available at http://localhost:5174
```

---

## 4. Configuration Reference (`.env`)

| Variable | Required | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | **Yes** | `https://api.vaultscope.de/api` | Base HTTP endpoint to the VAMOS API backend |
| `VITE_AUTHENTIK_URL` | **Yes** | `https://auth.vaultscope.de` | Authentik identity provider base URL |
| `VITE_OIDC_CLIENT_ID` | **Yes** | `vaultscope-storefront` | OIDC client ID configured for Storefront in Authentik |
| `VITE_OIDC_REDIRECT_URI` | **Yes** | `https://vaultscope.de/auth/callback` | Authorized OAuth2 redirect callback URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional | `pk_live_...` | Stripe public key for frontend checkout |
| `VITE_LISTMONK_URL` | Optional | `https://subscribe.vaultscope.de` | Newsletter subscription endpoint |

---

## 5. Verification & Health Checks

```bash
# 1. Check Docker container status
docker inspect --format='{{json .State.Health.Status}}' vaultscope-storefront
# Expected output: "healthy"

# 2. Test internal Caddy server
docker exec -it vaultscope-storefront wget -qO- http://localhost:3000

# 3. Test public endpoint
curl -I https://your-domain.com
# Expected output: HTTP/2 200 OK
```

---

## 6. Upgrading Procedures

### Automated Upgrades (`update.sh`)
```bash
sudo /opt/vaultscope/update.sh --branch=dev
```

### Manual Container Upgrade
```bash
cd /opt/vaultscope
cd website && git pull origin dev && cd ..
docker-compose -f docker-compose.production.yml build --no-cache storefront
docker-compose -f docker-compose.production.yml up -d --no-deps storefront
```

### Bare-Metal Upgrade
```bash
cd website
git pull origin dev
npm install
npm run build
```

---

## 7. Uninstallation Procedures

### Complete System Uninstallation
```bash
sudo /opt/vaultscope/uninstall.sh
```

### Standalone Manual Teardown
```bash
# 1. Stop and remove Docker container
docker stop vaultscope-storefront && docker rm vaultscope-storefront

# 2. Remove Nginx configuration
sudo rm -f /etc/nginx/sites-enabled/your-domain.com
sudo rm -f /etc/nginx/sites-available/your-domain.com
sudo systemctl reload nginx

# 3. Delete application files
sudo rm -rf /opt/vaultscope/website
```
