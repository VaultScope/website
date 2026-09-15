#!/usr/bin/env bash

#############################################################################
# VaultScope Full Stack Installer
#
# One-command installation for the complete VaultScope infrastructure:
# - VaultScope (Storefront)
# - VaultScope-API (VAMOS)
# - VaultScope-Admin (CAMOS)
# - PostgreSQL
# - Redis
# - Nginx (reverse proxy)
# - Let's Encrypt SSL
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | bash
#
# Or download and run:
#   wget https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh
#   chmod +x installer.sh
#   sudo ./installer.sh
#############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Installation directory
INSTALL_DIR="/opt/vaultscope"
CONFIG_DIR="/etc/vaultscope"
LOG_FILE="/var/log/vaultscope-install.log"

# Version to install
BRANCH="${VAULTSCOPE_BRANCH:-dev}"

#############################################################################
# Utility Functions
#############################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" | tee -a "$LOG_FILE" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $*" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" | tee -a "$LOG_FILE"
}

log_step() {
    echo -e "\n${BOLD}${CYAN}==>${NC} ${BOLD}$*${NC}\n" | tee -a "$LOG_FILE"
}

prompt() {
    local varname=$1
    local prompt_text=$2
    local default_value=$3

    if [ -n "$default_value" ]; then
        read -p "$(echo -e ${CYAN}${prompt_text}${NC} [${default_value}]: )" input
        eval "$varname=\"\${input:-$default_value}\""
    else
        read -p "$(echo -e ${CYAN}${prompt_text}${NC}: )" input
        eval "$varname=\"\$input\""
    fi
}

prompt_password() {
    local varname=$1
    local prompt_text=$2

    read -s -p "$(echo -e ${CYAN}${prompt_text}${NC}: )" input
    echo
    eval "$varname=\"\$input\""
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run as root. Please use sudo."
        exit 1
    fi
}

check_os() {
    log_step "Checking operating system"

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VERSION=$VERSION_ID
        log "Detected OS: $PRETTY_NAME"
    else
        log_error "Cannot detect OS. /etc/os-release not found."
        exit 1
    fi

    case $OS in
        ubuntu|debian)
            PACKAGE_MANAGER="apt-get"
            ;;
        centos|rhel|fedora)
            PACKAGE_MANAGER="yum"
            ;;
        *)
            log_error "Unsupported OS: $OS"
            exit 1
            ;;
    esac
}

check_dns() {
    local domain=$1
    local record_type=${2:-A}

    log_info "Checking DNS record for $domain ($record_type)"

    if host -t "$record_type" "$domain" > /dev/null 2>&1; then
        local ip=$(host -t "$record_type" "$domain" | awk '/has address/ { print $NF; exit }')
        log "✓ DNS record found: $domain -> $ip"
        return 0
    else
        log_warn "✗ DNS record not found for $domain"
        return 1
    fi
}

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

#############################################################################
# Dependency Installation
#############################################################################

install_docker() {
    log_step "Installing Docker"

    if command -v docker &> /dev/null; then
        log "Docker already installed: $(docker --version)"
        return 0
    fi

    log "Installing Docker..."

    case $PACKAGE_MANAGER in
        apt-get)
            apt-get update
            apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

            curl -fsSL https://download.docker.com/linux/$OS/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$OS $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

            apt-get update
            apt-get install -y docker-ce docker-ce-cli containerd.io
            ;;
        yum)
            yum install -y yum-utils
            yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            yum install -y docker-ce docker-ce-cli containerd.io
            ;;
    esac

    systemctl start docker
    systemctl enable docker

    log "Docker installed successfully: $(docker --version)"
}

install_docker_compose() {
    log_step "Installing Docker Compose"

    if command -v docker-compose &> /dev/null; then
        log "Docker Compose already installed: $(docker-compose --version)"
        return 0
    fi

    log "Installing Docker Compose..."

    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)

    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    chmod +x /usr/local/bin/docker-compose

    log "Docker Compose installed: $(docker-compose --version)"
}

install_nginx() {
    log_step "Installing Nginx"

    if command -v nginx &> /dev/null; then
        log "Nginx already installed: $(nginx -v 2>&1)"
        return 0
    fi

    log "Installing Nginx..."

    case $PACKAGE_MANAGER in
        apt-get)
            apt-get update
            apt-get install -y nginx
            ;;
        yum)
            yum install -y nginx
            ;;
    esac

    systemctl start nginx
    systemctl enable nginx

    log "Nginx installed successfully"
}

install_certbot() {
    log_step "Installing Certbot for SSL"

    if command -v certbot &> /dev/null; then
        log "Certbot already installed: $(certbot --version 2>&1 | head -n1)"
        return 0
    fi

    log "Installing Certbot..."

    case $PACKAGE_MANAGER in
        apt-get)
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
            ;;
        yum)
            yum install -y certbot python3-certbot-nginx
            ;;
    esac

    log "Certbot installed successfully"
}

install_dependencies() {
    log_step "Installing system dependencies"

    case $PACKAGE_MANAGER in
        apt-get)
            apt-get update
            apt-get install -y git curl wget gnupg2 openssl dnsutils
            ;;
        yum)
            yum install -y git curl wget gnupg2 openssl bind-utils
            ;;
    esac

    log "System dependencies installed"
}

#############################################################################
# Configuration Collection
#############################################################################

collect_configuration() {
    log_step "Collecting Configuration"

    echo
    echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║          VaultScope Configuration Setup                    ║${NC}"
    echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo

    # Release Branch Selection (Unified across all repositories)
    if [ -z "$VAULTSCOPE_BRANCH" ]; then
        echo -e "${BOLD}Release Branch Selection (Unified across all repositories):${NC}"
        echo -e "  ${GREEN}1) dev${NC}  - Latest active development (Recommended; required for upcoming updates)"
        echo -e "  ${BLUE}2) main${NC} - Production stable releases"
        echo -e "${NC}  Note: Branch selection is unified across Storefront, API, and Admin to ensure inter-service compatibility.${NC}"
        read -p "$(echo -e ${CYAN}Choose branch [1=dev / 2=main] (default: dev): ${NC})" branch_sel
        case "$branch_sel" in
            2|main) BRANCH="main" ;;
            *)      BRANCH="dev" ;;
        esac
        log_info "Selected release branch: ${BRANCH}"
        echo
    fi

    # Domain Configuration
    echo -e "${BOLD}Domain Configuration:${NC}"
    prompt DOMAIN_BASE "Enter your base domain (e.g., vaultscope.de)" "example.com"
    prompt DOMAIN_STOREFRONT "Storefront domain" "${DOMAIN_BASE}"
    prompt DOMAIN_API "API domain" "api.${DOMAIN_BASE}"
    prompt DOMAIN_ADMIN "Admin panel domain" "admin.${DOMAIN_BASE}"

    # Email for SSL certificates
    echo
    prompt EMAIL_ADMIN "Admin email (for SSL certificates)" "admin@${DOMAIN_BASE}"

    # Database Configuration
    echo
    echo -e "${BOLD}Database Configuration:${NC}"
    prompt DB_NAME "Database name" "vaultscope"
    prompt DB_USER "Database user" "vaultscope"
    DB_PASSWORD=$(generate_password)
    log_info "Generated database password: ${DB_PASSWORD}"

    # JWT and Encryption
    echo
    echo -e "${BOLD}Security Configuration:${NC}"
    JWT_SECRET=$(openssl rand -base64 64)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    log_info "Generated JWT secret and encryption key"

    # Authentik Configuration
    echo
    echo -e "${BOLD}Authentik OIDC Configuration:${NC}"
    prompt AUTHENTIK_ISSUER "Authentik issuer URL (e.g., https://auth.example.com)" "https://auth.${DOMAIN_BASE}"
    prompt AUTHENTIK_CLIENT_ID_ADMIN "Admin OIDC client ID" "vaultscope-admin"
    prompt_password AUTHENTIK_CLIENT_SECRET_ADMIN "Admin OIDC client secret"
    prompt AUTHENTIK_CLIENT_ID_STOREFRONT "Storefront OIDC client ID" "vaultscope-storefront"
    prompt_password AUTHENTIK_CLIENT_SECRET_STOREFRONT "Storefront OIDC client secret"

    # Redis Configuration
    REDIS_PASSWORD=$(generate_password)
    log_info "Generated Redis password"

    # Confirmation
    echo
    echo -e "${BOLD}Configuration Summary:${NC}"
    echo -e "  Storefront: ${GREEN}https://${DOMAIN_STOREFRONT}${NC}"
    echo -e "  API:        ${GREEN}https://${DOMAIN_API}${NC}"
    echo -e "  Admin:      ${GREEN}https://${DOMAIN_ADMIN}${NC}"
    echo -e "  Database:   ${GREEN}${DB_NAME}${NC} (user: ${DB_USER})"
    echo

    read -p "$(echo -e ${YELLOW}Proceed with installation? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Installation cancelled by user"
        exit 1
    fi
}

#############################################################################
# DNS Verification
#############################################################################

verify_dns() {
    log_step "Verifying DNS Configuration"

    local all_good=true

    for domain in "$DOMAIN_STOREFRONT" "$DOMAIN_API" "$DOMAIN_ADMIN"; do
        if ! check_dns "$domain"; then
            all_good=false
        fi
    done

    if [ "$all_good" = false ]; then
        log_warn "Some DNS records are not configured yet."
        echo
        echo -e "${YELLOW}Please configure the following DNS records:${NC}"
        echo -e "  ${DOMAIN_STOREFRONT} -> A record -> <your-server-ip>"
        echo -e "  ${DOMAIN_API}        -> A record -> <your-server-ip>"
        echo -e "  ${DOMAIN_ADMIN}      -> A record -> <your-server-ip>"
        echo
        read -p "$(echo -e ${YELLOW}Continue anyway? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Installation cancelled. Please configure DNS first."
            exit 1
        fi
    else
        log "All DNS records verified successfully!"
    fi
}

#############################################################################
# Repository Cloning
#############################################################################

clone_repositories() {
    log_step "Cloning VaultScope Repositories"

    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"

    # Clone storefront
    if [ ! -d "website" ]; then
        log "Cloning VaultScope Website..."
        git clone -b "$BRANCH" https://github.com/VaultScope/website.git
    else
        log "Website repository already exists, pulling latest changes..."
        cd website && git pull origin "$BRANCH" && cd ..
    fi

    # Clone API
    if [ ! -d "vamos" ]; then
        log "Cloning VaultScope API (VAMOS)..."
        git clone -b "$BRANCH" https://github.com/VaultScope/vamos.git
    else
        log "API repository already exists, pulling latest changes..."
        cd vamos && git pull origin "$BRANCH" && cd ..
    fi

    # Clone Admin
    if [ ! -d "camos" ]; then
        log "Cloning VaultScope Admin (CAMOS)..."
        git clone -b "$BRANCH" https://github.com/VaultScope/camos.git
    else
        log "Admin repository already exists, pulling latest changes..."
        cd camos && git pull origin "$BRANCH" && cd ..
    fi

    log "All repositories cloned successfully"
}

#############################################################################
# Environment Configuration
#############################################################################

generate_env_files() {
    log_step "Generating Environment Files"

    # API Environment
    log "Creating API environment file..."
    cat > "$INSTALL_DIR/vamos/.env" <<EOF
# Database
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
DB_MAX_CONNECTIONS=10

# Server
HOST=0.0.0.0
PORT=3000

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION_SECS=3600

# Encryption
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Authentik OIDC
AUTHENTIK_ISSUER=${AUTHENTIK_ISSUER}
AUTHENTIK_CLIENT_ID_ADMIN=${AUTHENTIK_CLIENT_ID_ADMIN}
AUTHENTIK_CLIENT_SECRET_ADMIN=${AUTHENTIK_CLIENT_SECRET_ADMIN}
AUTHENTIK_CLIENT_ID_STOREFRONT=${AUTHENTIK_CLIENT_ID_STOREFRONT}
AUTHENTIK_CLIENT_SECRET_STOREFRONT=${AUTHENTIK_CLIENT_SECRET_STOREFRONT}

# CORS
CORS_ORIGINS=https://${DOMAIN_STOREFRONT},https://${DOMAIN_ADMIN}

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_STATE_TTL_SECS=300

# Job Runner
JOB_POLL_INTERVAL_SECS=5
JOB_MAX_CONCURRENT=10
JOB_TIMEOUT_SECS=1800

# Rate Limiting
RATE_LIMIT_ANONYMOUS=60
RATE_LIMIT_AUTHENTICATED=300

# Logging
RUST_LOG=info
LOG_FORMAT=json
EOF

    # Storefront Environment
    log "Creating Storefront environment file..."
    cat > "$INSTALL_DIR/website/.env.production" <<EOF
VITE_API_URL=https://${DOMAIN_API}/api
VITE_AUTHENTIK_URL=${AUTHENTIK_ISSUER}
VITE_OIDC_CLIENT_ID=${AUTHENTIK_CLIENT_ID_STOREFRONT}
VITE_OIDC_REDIRECT_URI=https://${DOMAIN_STOREFRONT}/auth/callback
EOF

    # Admin Environment
    log "Creating Admin environment file..."
    cat > "$INSTALL_DIR/camos/.env.production" <<EOF
VITE_API_URL=https://${DOMAIN_API}/api
VITE_AUTHENTIK_URL=${AUTHENTIK_ISSUER}
VITE_OIDC_CLIENT_ID=${AUTHENTIK_CLIENT_ID_ADMIN}
VITE_OIDC_REDIRECT_URI=https://${DOMAIN_ADMIN}/auth/callback
EOF

    log "Environment files created successfully"
}

#############################################################################
# Docker Compose Configuration
#############################################################################

create_docker_compose() {
    log_step "Creating Docker Compose Configuration"

    cat > "$INSTALL_DIR/docker-compose.production.yml" <<EOF
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: vaultscope-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./vamos/crates/db/migrations:/docker-entrypoint-initdb.d
    networks:
      - vaultscope-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: vaultscope-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - vaultscope-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./vamos
      dockerfile: Dockerfile
    container_name: vaultscope-api
    restart: unless-stopped
    env_file:
      - ./vamos/.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - vaultscope-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  storefront:
    build:
      context: ./website
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://${DOMAIN_API}/api
        - VITE_AUTHENTIK_URL=${AUTHENTIK_ISSUER}
        - VITE_OIDC_CLIENT_ID=${AUTHENTIK_CLIENT_ID_STOREFRONT}
        - VITE_OIDC_REDIRECT_URI=https://${DOMAIN_STOREFRONT}/auth/callback
    container_name: vaultscope-storefront
    restart: unless-stopped
    networks:
      - vaultscope-network

  admin:
    build:
      context: ./camos
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://${DOMAIN_API}/api
        - VITE_AUTHENTIK_URL=${AUTHENTIK_ISSUER}
        - VITE_OIDC_CLIENT_ID=${AUTHENTIK_CLIENT_ID_ADMIN}
        - VITE_OIDC_REDIRECT_URI=https://${DOMAIN_ADMIN}/auth/callback
    container_name: vaultscope-admin
    restart: unless-stopped
    networks:
      - vaultscope-network

networks:
  vaultscope-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
EOF

    log "Docker Compose configuration created"
}

#############################################################################
# Nginx Configuration
#############################################################################

configure_nginx() {
    log_step "Configuring Nginx"

    # Storefront configuration
    log "Creating Nginx configuration for storefront..."
    cat > "/etc/nginx/sites-available/${DOMAIN_STOREFRONT}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_STOREFRONT};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN_STOREFRONT};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN_STOREFRONT}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_STOREFRONT}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # API configuration
    log "Creating Nginx configuration for API..."
    cat > "/etc/nginx/sites-available/${DOMAIN_API}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_API};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN_API};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN_API}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_API}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # CORS headers (if not handled by API)
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        # Increase timeout for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

    # Admin configuration
    log "Creating Nginx configuration for admin..."
    cat > "/etc/nginx/sites-available/${DOMAIN_ADMIN}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_ADMIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN_ADMIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN_ADMIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_ADMIN}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Enable sites
    mkdir -p /etc/nginx/sites-enabled
    ln -sf "/etc/nginx/sites-available/${DOMAIN_STOREFRONT}" /etc/nginx/sites-enabled/
    ln -sf "/etc/nginx/sites-available/${DOMAIN_API}" /etc/nginx/sites-enabled/
    ln -sf "/etc/nginx/sites-available/${DOMAIN_ADMIN}" /etc/nginx/sites-enabled/

    # Test configuration
    if nginx -t; then
        log "Nginx configuration valid"
    else
        log_error "Nginx configuration test failed"
        exit 1
    fi
}

#############################################################################
# SSL Certificate Setup
#############################################################################

setup_ssl() {
    log_step "Setting up SSL Certificates"

    mkdir -p /var/www/certbot

    # Reload nginx for HTTP challenge
    systemctl reload nginx

    log "Obtaining SSL certificate for ${DOMAIN_STOREFRONT}..."
    certbot certonly --nginx -d "${DOMAIN_STOREFRONT}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}" || log_warn "Failed to obtain cert for ${DOMAIN_STOREFRONT}"

    log "Obtaining SSL certificate for ${DOMAIN_API}..."
    certbot certonly --nginx -d "${DOMAIN_API}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}" || log_warn "Failed to obtain cert for ${DOMAIN_API}"

    log "Obtaining SSL certificate for ${DOMAIN_ADMIN}..."
    certbot certonly --nginx -d "${DOMAIN_ADMIN}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}" || log_warn "Failed to obtain cert for ${DOMAIN_ADMIN}"

    # Setup auto-renewal
    (crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet") | crontab -

    log "SSL certificates configured"
}

#############################################################################
# Database Setup
#############################################################################

setup_database() {
    log_step "Setting up Database"

    cd "$INSTALL_DIR"

    # Start postgres and redis first
    docker-compose -f docker-compose.production.yml up -d postgres redis

    log "Waiting for PostgreSQL to be ready..."
    sleep 10

    # Run migrations
    log "Running database migrations..."
    docker-compose -f docker-compose.production.yml exec -T postgres psql -U "${DB_USER}" -d "${DB_NAME}" <<EOF
-- Database migrations will run automatically from init scripts
SELECT version();
EOF

    log "Database setup complete"
}

#############################################################################
# Application Deployment
#############################################################################

deploy_application() {
    log_step "Deploying Application"

    cd "$INSTALL_DIR"

    log "Building and starting all services..."
    docker-compose -f docker-compose.production.yml up -d --build

    log "Waiting for services to be healthy..."
    sleep 30

    # Check health
    if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
        log "Application deployed successfully!"
    else
        log_error "Some services failed to start. Check logs with: docker-compose -f docker-compose.production.yml logs"
    fi
}

#############################################################################
# Systemd Service
#############################################################################

create_systemd_service() {
    log_step "Creating Systemd Service"

    cat > /etc/systemd/system/vaultscope.service <<EOF
[Unit]
Description=VaultScope Full Stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable vaultscope.service

    log "Systemd service created and enabled"
}

#############################################################################
# Save Configuration
#############################################################################

save_configuration() {
    log_step "Saving Configuration"

    mkdir -p "$CONFIG_DIR"

    cat > "$CONFIG_DIR/config.env" <<EOF
# VaultScope Configuration
# Generated: $(date)

DOMAIN_STOREFRONT=${DOMAIN_STOREFRONT}
DOMAIN_API=${DOMAIN_API}
DOMAIN_ADMIN=${DOMAIN_ADMIN}
EMAIL_ADMIN=${EMAIL_ADMIN}

DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

REDIS_PASSWORD=${REDIS_PASSWORD}

JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

AUTHENTIK_ISSUER=${AUTHENTIK_ISSUER}
AUTHENTIK_CLIENT_ID_ADMIN=${AUTHENTIK_CLIENT_ID_ADMIN}
AUTHENTIK_CLIENT_ID_STOREFRONT=${AUTHENTIK_CLIENT_ID_STOREFRONT}

INSTALL_DIR=${INSTALL_DIR}
BRANCH=${BRANCH}
EOF

    chmod 600 "$CONFIG_DIR/config.env"

    log "Configuration saved to $CONFIG_DIR/config.env"
}

#############################################################################
# Post-Installation
#############################################################################

show_completion_message() {
    clear
    echo
    echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}║          ✓ VaultScope Installation Complete!               ║${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo
    echo -e "${BOLD}Your VaultScope infrastructure is now running!${NC}"
    echo
    echo -e "${BOLD}Access your services:${NC}"
    echo -e "  🌐 Storefront:  ${GREEN}https://${DOMAIN_STOREFRONT}${NC}"
    echo -e "  🔧 API:         ${GREEN}https://${DOMAIN_API}${NC}"
    echo -e "  ⚙️  Admin Panel: ${GREEN}https://${DOMAIN_ADMIN}${NC}"
    echo
    echo -e "${BOLD}Credentials saved in:${NC} ${CONFIG_DIR}/config.env"
    echo
    echo -e "${BOLD}Useful commands:${NC}"
    echo -e "  View logs:        ${CYAN}docker-compose -f ${INSTALL_DIR}/docker-compose.production.yml logs -f${NC}"
    echo -e "  Restart services: ${CYAN}systemctl restart vaultscope${NC}"
    echo -e "  Stop services:    ${CYAN}systemctl stop vaultscope${NC}"
    echo -e "  Service status:   ${CYAN}docker-compose -f ${INSTALL_DIR}/docker-compose.production.yml ps${NC}"
    echo
    echo -e "${BOLD}${YELLOW}Next steps:${NC}"
    echo -e "  1. Configure your Authentik OIDC clients"
    echo -e "  2. Access the admin panel and create your first admin user"
    echo -e "  3. Configure provider connectors (Hetzner, OVH, etc.)"
    echo -e "  4. Customize email templates and branding"
    echo
    echo -e "${BOLD}Documentation:${NC} https://docs.vaultscope.de"
    echo -e "${BOLD}Support:${NC} support@vaultscope.de"
    echo
    echo -e "${GREEN}Thank you for choosing VaultScope! 🚀${NC}"
    echo
}

#############################################################################
# Main Installation Flow
#############################################################################

main() {
    echo
    echo -e "${BOLD}${CYAN}"
    cat <<'EOF'
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗███████╗       ║
║   ██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██╔════╝       ║
║   ██║   ██║███████║██║   ██║██║     ██║   ███████╗       ║
║   ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ╚════██║       ║
║    ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ███████║       ║
║     ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚══════╝       ║
║                                                            ║
║            Full Stack Installer v1.0                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo

    # Pre-flight checks
    check_root
    check_os

    # Installation
    install_dependencies
    install_docker
    install_docker_compose
    install_nginx
    install_certbot

    # Configuration
    collect_configuration
    verify_dns

    # Setup
    clone_repositories
    generate_env_files
    create_docker_compose
    setup_database
    configure_nginx
    setup_ssl
    systemctl reload nginx

    # Deploy
    deploy_application
    create_systemd_service
    save_configuration

    # Complete
    show_completion_message

    log "Installation completed successfully at $(date)"
}

# Run main installation
main "$@"
