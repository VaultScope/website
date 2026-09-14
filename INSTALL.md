# VaultScope One-Command Installation

Deploy the complete VaultScope infrastructure with a single command.

## 🚀 Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash
```

Or download and run:

```bash
wget https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh
chmod +x installer.sh
sudo ./installer.sh
```

## 📋 What Gets Installed

The installer automatically sets up:

- ✅ **VaultScope Storefront** - Customer-facing website
- ✅ **VaultScope API (VAMOS)** - Backend API and provisioning engine
- ✅ **VaultScope Admin (CAMOS)** - Administrative panel
- ✅ **PostgreSQL 16** - Database
- ✅ **Redis 7** - Caching and session storage
- ✅ **Nginx** - Reverse proxy
- ✅ **Let's Encrypt SSL** - Automatic HTTPS certificates
- ✅ **Docker & Docker Compose** - Container orchestration
- ✅ **Systemd Service** - Auto-start on boot

## 🔧 Prerequisites

### Server Requirements

- **OS**: Ubuntu 20.04+, Debian 11+, CentOS 8+, or RHEL 8+
- **CPU**: 4+ cores recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Disk**: 50GB+ free space
- **Network**: Public IPv4 address

### DNS Configuration

Before running the installer, configure your DNS:

```
your-domain.com         → A record → <your-server-ip>
api.your-domain.com     → A record → <your-server-ip>
admin.your-domain.com   → A record → <your-server-ip>
```

### Authentik Setup

You need a running Authentik instance with:

1. **Admin OIDC Client**:
   - Client ID: `vaultscope-admin`
   - Redirect URI: `https://admin.your-domain.com/auth/callback`
   - Scopes: `openid`, `profile`, `email`

2. **Storefront OIDC Client**:
   - Client ID: `vaultscope-storefront`
   - Redirect URI: `https://your-domain.com/auth/callback`
   - Scopes: `openid`, `profile`, `email`

## 📝 Installation Process

The installer will:

1. **Check System** - Verify OS compatibility
2. **Install Dependencies** - Docker, Docker Compose, Nginx, Certbot
3. **Collect Configuration** - Domains, email, Authentik credentials
4. **Verify DNS** - Check that your domains resolve correctly
5. **Clone Repositories** - Download VaultScope components
6. **Generate Configurations** - Create environment files
7. **Setup SSL** - Obtain Let's Encrypt certificates
8. **Initialize Database** - Create database and run migrations
9. **Deploy Services** - Build and start Docker containers
10. **Create Systemd Service** - Enable auto-start

Total time: ~10-15 minutes

## 🎯 Configuration Prompts

During installation, you'll be asked for:

### Domain Configuration
- Base domain (e.g., `vaultscope.de`)
- Storefront domain (e.g., `vaultscope.de`)
- API domain (e.g., `api.vaultscope.de`)
- Admin domain (e.g., `admin.vaultscope.de`)

### Email
- Admin email (for SSL certificates and notifications)

### Database
- Database name (default: `vaultscope`)
- Database user (default: `vaultscope`)
- Password (auto-generated)

### Authentik OIDC
- Authentik issuer URL (e.g., `https://auth.vaultscope.de`)
- Admin client ID and secret
- Storefront client ID and secret

## 📂 Installation Locations

After installation:

```
/opt/vaultscope/               # Application files
├── website/                   # Storefront
├── vamos/                     # API
├── camos/                     # Admin panel
└── docker-compose.production.yml

/etc/vaultscope/               # Configuration
└── config.env                 # Saved credentials

/var/log/vaultscope-install.log  # Installation log

/etc/nginx/sites-available/    # Nginx configs
├── your-domain.com
├── api.your-domain.com
└── admin.your-domain.com

/etc/systemd/system/
└── vaultscope.service         # Systemd service
```

## 🔐 Security

The installer automatically:

- Generates secure random passwords (32 characters)
- Creates JWT secrets (64 bytes) and encryption keys (32 bytes)
- Obtains SSL certificates from Let's Encrypt
- Configures Nginx with secure SSL settings (TLS 1.2+)
- Stores credentials in `/etc/vaultscope/config.env` (600 permissions)
- Sets up automatic certificate renewal

## 🛠️ Post-Installation

### Access Your Services

- **Storefront**: `https://your-domain.com`
- **API**: `https://api.your-domain.com`
- **Admin Panel**: `https://admin.your-domain.com`

### View Credentials

```bash
sudo cat /etc/vaultscope/config.env
```

### Check Service Status

```bash
# Docker containers
cd /opt/vaultscope
docker-compose -f docker-compose.production.yml ps

# Systemd service
sudo systemctl status vaultscope

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### Manage Services

```bash
# Restart all services
sudo systemctl restart vaultscope

# Stop all services
sudo systemctl stop vaultscope

# Start all services
sudo systemctl start vaultscope

# Restart individual service
cd /opt/vaultscope
docker-compose -f docker-compose.production.yml restart api
```

## 🔄 Updates

To update to the latest version:

```bash
cd /opt/vaultscope

# Pull latest code
cd website && git pull origin dev && cd ..
cd vamos && git pull origin dev && cd ..
cd camos && git pull origin dev && cd ..

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

## 🐛 Troubleshooting

### DNS Not Resolving

If DNS verification fails:

```bash
# Check DNS propagation
dig your-domain.com
dig api.your-domain.com
dig admin.your-domain.com

# Continue anyway (not recommended for production)
# The installer will ask if you want to continue
```

### SSL Certificate Fails

If Let's Encrypt fails:

```bash
# Check Nginx is running
sudo systemctl status nginx

# Manually obtain certificate
sudo certbot certonly --nginx -d your-domain.com

# Check port 80 is accessible
sudo netstat -tlnp | grep :80
```

### Services Not Starting

```bash
# Check Docker
sudo systemctl status docker

# Check logs
cd /opt/vaultscope
docker-compose -f docker-compose.production.yml logs

# Rebuild specific service
docker-compose -f docker-compose.production.yml up -d --build api
```

### Database Connection Issues

```bash
# Check PostgreSQL
docker-compose -f docker-compose.production.yml exec postgres psql -U vaultscope -d vaultscope

# Check environment variables
cat /opt/vaultscope/vamos/.env | grep DATABASE_URL
```

### Port Conflicts

If ports are already in use:

```bash
# Check what's using port 3000 (API)
sudo netstat -tlnp | grep :3000

# Check what's using ports 8080, 8081 (frontends)
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :8081
```

## 🔥 Uninstall

To completely remove VaultScope:

```bash
# Stop and remove containers
cd /opt/vaultscope
docker-compose -f docker-compose.production.yml down -v

# Remove application files
sudo rm -rf /opt/vaultscope

# Remove configuration
sudo rm -rf /etc/vaultscope

# Remove Nginx configs
sudo rm /etc/nginx/sites-enabled/your-domain.com
sudo rm /etc/nginx/sites-enabled/api.your-domain.com
sudo rm /etc/nginx/sites-enabled/admin.your-domain.com
sudo rm /etc/nginx/sites-available/your-domain.com
sudo rm /etc/nginx/sites-available/api.your-domain.com
sudo rm /etc/nginx/sites-available/admin.your-domain.com

# Remove systemd service
sudo systemctl stop vaultscope
sudo systemctl disable vaultscope
sudo rm /etc/systemd/system/vaultscope.service
sudo systemctl daemon-reload

# Reload Nginx
sudo systemctl reload nginx
```

## 📖 Advanced Configuration

### Custom Branch

Install from a different branch:

```bash
VAULTSCOPE_BRANCH=main curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash
```

### Custom Installation Directory

Edit the installer before running:

```bash
wget https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh
nano installer.sh  # Change INSTALL_DIR variable
sudo ./installer.sh
```

### Skip DNS Verification

Set environment variable:

```bash
SKIP_DNS_CHECK=1 sudo ./installer.sh
```

## 🆘 Support

- **Documentation**: https://docs.vaultscope.de
- **GitHub Issues**: https://github.com/VaultScope/website/issues
- **Email**: support@vaultscope.de
- **Installation Log**: `/var/log/vaultscope-install.log`

## 📄 License

See LICENSE file in each repository.

---

Built with ❤️ by the VaultScope team
