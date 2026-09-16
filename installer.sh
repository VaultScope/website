#!/usr/bin/env bash

#############################################################################
# VaultScope Full Stack Installer - Production Grade
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

set -euo pipefail  # Exit on error, undefined vars, pipe failures

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
BACKUP_DIR="/opt/vaultscope-backup-$(date +%Y%m%d-%H%M%S)"

# Version to install
BRANCH="${VAULTSCOPE_BRANCH:-dev}"

# Git clone timeout
GIT_CLONE_TIMEOUT=300

# Cleanup tracking
CLEANUP_REQUIRED=false
NGINX_CONFIGS_CREATED=()
DOCKER_STARTED=false

#############################################################################
# Cleanup and Rollback
#############################################################################

cleanup_on_failure() {
    local exit_code=$?

    if [ $exit_code -ne 0 ] && [ "$CLEANUP_REQUIRED" = true ]; then
        log_error "Installation failed with exit code $exit_code. Starting rollback..."

        # Stop Docker containers
        if [ "$DOCKER_STARTED" = true ] && [ -f "$INSTALL_DIR/docker-compose.production.yml" ]; then
            log_warn "Stopping Docker containers..."
            cd "$INSTALL_DIR" || true
            docker-compose -f docker-compose.production.yml down 2>/dev/null || true
        fi

        # Remove Nginx configs
        for config in "${NGINX_CONFIGS_CREATED[@]}"; do
            log_warn "Removing Nginx config: $config"
            rm -f "/etc/nginx/sites-enabled/$(basename "$config")" 2>/dev/null || true
            rm -f "$config" 2>/dev/null || true
        done

        # Reload Nginx
        if command -v nginx &> /dev/null; then
            systemctl reload nginx 2>/dev/null || true
        fi

        log_warn "Rollback complete. Installation directory preserved at: $INSTALL_DIR"
        log_warn "Log file available at: $LOG_FILE"
    fi
}

trap cleanup_on_failure EXIT

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
    local input

    if [ -n "$default_value" ]; then
        read -r -p "$(echo -e "${CYAN}${prompt_text}${NC} [${default_value}]: ")" input
        printf -v "$varname" '%s' "${input:-$default_value}"
    else
        read -r -p "$(echo -e "${CYAN}${prompt_text}${NC}: ")" input
        printf -v "$varname" '%s' "$input"
    fi
}

prompt_password() {
    local varname=$1
    local prompt_text=$2
    local input

    read -r -s -p "$(echo -e "${CYAN}${prompt_text}${NC}: ")" input
    echo
    printf -v "$varname" '%s' "$input"
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
        # shellcheck source=/dev/null
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
        local ip
        ip=$(host -t "$record_type" "$domain" | awk '/has address/ { print $NF; exit }')
        log "✓ DNS record found: $domain -> $ip"
        return 0
    else
        log_warn "✗ DNS record not found for $domain"
        return 1
    fi
}

generate_password() {
    openssl rand -base64 48 | tr -d "=+/" | head -c 32
}

#############################################################################
# Input Validation Functions
#############################################################################

validate_domain() {
    local domain=$1

    # Basic domain validation regex
    if [[ $domain =~ ^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$ ]]; then
        return 0
    else
        log_error "Invalid domain format: $domain"
        return 1
    fi
}

validate_email() {
    local email=$1

    # Basic email validation
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        log_error "Invalid email format: $email"
        return 1
    fi
}

validate_branch() {
    local branch=$1

    if [[ "$branch" == "dev" ]] || [[ "$branch" == "main" ]]; then
        return 0
    else
        log_error "Invalid branch: $branch (must be 'dev' or 'main')"
        return 1
    fi
}

validate_url() {
    local url=$1

    # Basic URL validation
    if [[ $url =~ ^https?://[a-zA-Z0-9.-]+(/.*)?$ ]]; then
        return 0
    else
        log_error "Invalid URL format: $url"
        return 1
    fi
}

#############################################################################
# Preflight Checks
#############################################################################

check_ports() {
    log_info "Checking required ports..."

    local required_ports=(80 443 3000 5432 6379 8080 8081)
    local ports_in_use=()

    for port in "${required_ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; then
            ports_in_use+=("$port")
        fi
    done

    if [ ${#ports_in_use[@]} -gt 0 ]; then
        log_warn "The following ports are already in use: ${ports_in_use[*]}"
        log_warn "Installation may fail if these ports are needed."
        read -r -p "$(echo -e "${YELLOW}Continue anyway? [y/N]: ${NC}")" -n 1
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Installation cancelled due to port conflicts"
            exit 1
        fi
    else
        log "✓ All required ports are available"
    fi
}

check_disk_space() {
    log_info "Checking disk space..."

    local required_space_mb=10240  # 10GB minimum
    local available_space_mb
    available_space_mb=$(df -m /opt | tail -1 | awk '{print $4}')

    if [ "$available_space_mb" -lt "$required_space_mb" ]; then
        log_error "Insufficient disk space. Required: ${required_space_mb}MB, Available: ${available_space_mb}MB"
        exit 1
    else
        log "✓ Sufficient disk space available: ${available_space_mb}MB"
    fi
}

check_internet() {
    log_info "Checking internet connectivity..."

    if curl -s --max-time 10 https://github.com > /dev/null 2>&1; then
        log "✓ Internet connection verified"
    else
        log_error "Cannot reach GitHub. Please check your internet connection."
        exit 1
    fi
}

run_preflight_checks() {
    log_step "Running Preflight Checks"

    check_ports
    check_disk_space
    check_internet

    log "✓ All preflight checks passed"
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

            curl -fsSL "https://download.docker.com/linux/$OS/gpg" | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

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

    local compose_version
    if ! compose_version=$(curl -fsSL --max-time 30 https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4); then
        log_error "Failed to fetch Docker Compose version from GitHub API"
        exit 1
    fi

    if [ -z "$compose_version" ]; then
        log_error "Could not determine Docker Compose version"
        exit 1
    fi

    if ! curl -fsSL --max-time 300 "https://github.com/docker/compose/releases/download/${compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose; then
        log_error "Failed to download Docker Compose"
        exit 1
    fi

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
            apt-get install -y git curl wget gnupg2 openssl dnsutils net-tools
            ;;
        yum)
            yum install -y git curl wget gnupg2 openssl bind-utils net-tools
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
        read -r -p "$(echo -e "${CYAN}Choose branch [1=dev / 2=main] (default: dev): ${NC}")" branch_sel
        case "$branch_sel" in
            2|main) BRANCH="main" ;;
            *)      BRANCH="dev" ;;
        esac

        if ! validate_branch "$BRANCH"; then
            log_error "Invalid branch selection"
            exit 1
        fi

        log_info "Selected release branch: ${BRANCH}"
        echo
    fi

    # Domain Configuration
    echo -e "${BOLD}Domain Configuration:${NC}"

    while true; do
        prompt DOMAIN_BASE "Enter your base domain (e.g., vaultscope.de)" "example.com"
        if validate_domain "$DOMAIN_BASE"; then
            break
        fi
        log_warn "Please enter a valid domain"
    done

    while true; do
        prompt DOMAIN_STOREFRONT "Storefront domain" "${DOMAIN_BASE}"
        if validate_domain "$DOMAIN_STOREFRONT"; then
            break
        fi
        log_warn "Please enter a valid domain"
    done

    while true; do
        prompt DOMAIN_API "API domain" "api.${DOMAIN_BASE}"
        if validate_domain "$DOMAIN_API"; then
            break
        fi
        log_warn "Please enter a valid domain"
    done

    while true; do
        prompt DOMAIN_ADMIN "Admin panel domain" "admin.${DOMAIN_BASE}"
        if validate_domain "$DOMAIN_ADMIN"; then
            break
        fi
        log_warn "Please enter a valid domain"
    done

    # Email for SSL certificates
    echo
    while true; do
        prompt EMAIL_ADMIN "Admin email (for SSL certificates)" "admin@${DOMAIN_BASE}"
        if validate_email "$EMAIL_ADMIN"; then
            break
        fi
        log_warn "Please enter a valid email address"
    done

    # Database Configuration
    echo
    echo -e "${BOLD}Database Configuration:${NC}"
    prompt DB_NAME "Database name" "vaultscope"
    prompt DB_USER "Database user" "vaultscope"
    DB_PASSWORD=$(generate_password)
    log_info "Generated database password (not shown for security)"

    # JWT and Encryption
    echo
    echo -e "${BOLD}Security Configuration:${NC}"
    JWT_SECRET=$(openssl rand -base64 64)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    log_info "Generated JWT secret and encryption key (not shown for security)"

    # Authentik Configuration
    echo
    echo -e "${BOLD}Authentik OIDC Configuration:${NC}"

    while true; do
        prompt AUTHENTIK_ISSUER "Authentik issuer URL (e.g., https://auth.example.com)" "https://auth.${DOMAIN_BASE}"
        if validate_url "$AUTHENTIK_ISSUER"; then
            break
        fi
        log_warn "Please enter a valid URL"
    done

    prompt AUTHENTIK_CLIENT_ID_ADMIN "Admin OIDC client ID" "vaultscope-admin"
    prompt_password AUTHENTIK_CLIENT_SECRET_ADMIN "Admin OIDC client secret"

    if [ -z "$AUTHENTIK_CLIENT_SECRET_ADMIN" ]; then
        log_error "Admin OIDC client secret cannot be empty"
        exit 1
    fi

    prompt AUTHENTIK_CLIENT_ID_STOREFRONT "Storefront OIDC client ID" "vaultscope-storefront"
    prompt_password AUTHENTIK_CLIENT_SECRET_STOREFRONT "Storefront OIDC client secret"

    if [ -z "$AUTHENTIK_CLIENT_SECRET_STOREFRONT" ]; then
        log_error "Storefront OIDC client secret cannot be empty"
        exit 1
    fi

    # Redis Configuration
    REDIS_PASSWORD=$(generate_password)
    log_info "Generated Redis password (not shown for security)"

    # Confirmation
    echo
    echo -e "${BOLD}Configuration Summary:${NC}"
    echo -e "  Branch:     ${GREEN}${BRANCH}${NC}"
    echo -e "  Storefront: ${GREEN}https://${DOMAIN_STOREFRONT}${NC}"
    echo -e "  API:        ${GREEN}https://${DOMAIN_API}${NC}"
    echo -e "  Admin:      ${GREEN}https://${DOMAIN_ADMIN}${NC}"
    echo -e "  Database:   ${GREEN}${DB_NAME}${NC} (user: ${DB_USER})"
    echo

    read -r -p "$(echo -e "${YELLOW}Proceed with installation? [y/N]: ${NC}")" -n 1
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Installation cancelled by user"
        exit 1
    fi

    CLEANUP_REQUIRED=true
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
        read -r -p "$(echo -e "${YELLOW}Continue anyway? [y/N]: ${NC}")" -n 1
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

    if ! cd "$INSTALL_DIR"; then
        log_error "Failed to change to directory: $INSTALL_DIR"
        exit 1
    fi

    # Clone storefront
    if [ ! -d "website" ]; then
        log "Cloning VaultScope Website..."
        if ! timeout "$GIT_CLONE_TIMEOUT" git clone -b "$BRANCH" https://github.com/VaultScope/website.git; then
            log_error "Failed to clone website repository (timeout or error after ${GIT_CLONE_TIMEOUT}s)"
            exit 1
        fi
    else
        log "Website repository already exists, pulling latest changes..."
        if ! cd website; then
            log_error "Failed to change to directory: website"
            exit 1
        fi
        if ! timeout "$GIT_CLONE_TIMEOUT" git pull origin "$BRANCH"; then
            log_error "Failed to pull latest changes for website"
            exit 1
        fi
        if ! cd ..; then
            log_error "Failed to return to parent directory"
            exit 1
        fi
    fi

    # Clone API
    if [ ! -d "vamos" ]; then
        log "Cloning VaultScope API (VAMOS)..."
        if ! timeout "$GIT_CLONE_TIMEOUT" git clone -b "$BRANCH" https://github.com/VaultScope/vamos.git; then
            log_error "Failed to clone vamos repository (timeout or error after ${GIT_CLONE_TIMEOUT}s)"
            exit 1
        fi
    else
        log "API repository already exists, pulling latest changes..."
        if ! cd vamos; then
            log_error "Failed to change to directory: vamos"
            exit 1
        fi
        if ! timeout "$GIT_CLONE_TIMEOUT" git pull origin "$BRANCH"; then
            log_error "Failed to pull latest changes for vamos"
            exit 1
        fi
        if ! cd ..; then
            log_error "Failed to return to parent directory"
            exit 1
        fi
    fi

    # Clone Admin
    if [ ! -d "camos" ]; then
        log "Cloning VaultScope Admin (CAMOS)..."
        if ! timeout "$GIT_CLONE_TIMEOUT" git clone -b "$BRANCH" https://github.com/VaultScope/camos.git; then
            log_error "Failed to clone camos repository (timeout or error after ${GIT_CLONE_TIMEOUT}s)"
            exit 1
        fi
    else
        log "Admin repository already exists, pulling latest changes..."
        if ! cd camos; then
            log_error "Failed to change to directory: camos"
            exit 1
        fi
        if ! timeout "$GIT_CLONE_TIMEOUT" git pull origin "$BRANCH"; then
            log_error "Failed to pull latest changes for camos"
            exit 1
        fi
        if ! cd ..; then
            log_error "Failed to return to parent directory"
            exit 1
        fi
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
    (umask 077 && cat > "$INSTALL_DIR/vamos/.env") <<EOF
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
    (umask 077 && cat > "$INSTALL_DIR/website/.env.production") <<EOF
VITE_API_URL=https://${DOMAIN_API}/api
VITE_AUTHENTIK_URL=${AUTHENTIK_ISSUER}
VITE_OIDC_CLIENT_ID=${AUTHENTIK_CLIENT_ID_STOREFRONT}
VITE_OIDC_REDIRECT_URI=https://${DOMAIN_STOREFRONT}/auth/callback
EOF

    # Admin Environment
    log "Creating Admin environment file..."
    (umask 077 && cat > "$INSTALL_DIR/camos/.env.production") <<EOF
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
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

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
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 256M

  api:
    build:
      context: ./vamos
      dockerfile: Dockerfile
    container_name: vaultscope-api
    restart: unless-stopped
    ports:
      - "3000:3000"
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
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

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
    ports:
      - "8080:80"
    networks:
      - vaultscope-network
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M

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
    ports:
      - "8081:80"
    networks:
      - vaultscope-network
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M

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
# Nginx Configuration - Two Stage (HTTP first, then HTTPS)
#############################################################################

configure_nginx_http_only() {
    log_step "Configuring Nginx (HTTP-only for Let's Encrypt)"

    # Storefront configuration (HTTP only)
    log "Creating HTTP-only Nginx configuration for storefront..."
    cat > "/etc/nginx/sites-available/${DOMAIN_STOREFRONT}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_STOREFRONT};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

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
    NGINX_CONFIGS_CREATED+=("/etc/nginx/sites-available/${DOMAIN_STOREFRONT}")

    # API configuration (HTTP only)
    log "Creating HTTP-only Nginx configuration for API..."
    cat > "/etc/nginx/sites-available/${DOMAIN_API}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_API};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Increase timeout for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
    NGINX_CONFIGS_CREATED+=("/etc/nginx/sites-available/${DOMAIN_API}")

    # Admin configuration (HTTP only)
    log "Creating HTTP-only Nginx configuration for admin..."
    cat > "/etc/nginx/sites-available/${DOMAIN_ADMIN}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN_ADMIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

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
    NGINX_CONFIGS_CREATED+=("/etc/nginx/sites-available/${DOMAIN_ADMIN}")

    # Enable sites
    mkdir -p /etc/nginx/sites-enabled
    ln -sf "/etc/nginx/sites-available/${DOMAIN_STOREFRONT}" /etc/nginx/sites-enabled/
    ln -sf "/etc/nginx/sites-available/${DOMAIN_API}" /etc/nginx/sites-enabled/
    ln -sf "/etc/nginx/sites-available/${DOMAIN_ADMIN}" /etc/nginx/sites-enabled/

    # Test configuration
    if nginx -t; then
        log "Nginx HTTP configuration valid"
    else
        log_error "Nginx configuration test failed"
        exit 1
    fi
}

configure_nginx_https() {
    log_step "Upgrading Nginx to HTTPS with SSL"

    # Strong SSL cipher suite (modern browsers, TLS 1.2+)
    local SSL_CIPHERS="ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384"

    # Storefront configuration (HTTPS)
    log "Creating HTTPS Nginx configuration for storefront..."
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
    ssl_ciphers ${SSL_CIPHERS};
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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

    # API configuration (HTTPS)
    log "Creating HTTPS Nginx configuration for API..."
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
    ssl_ciphers ${SSL_CIPHERS};
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Complete CORS headers (handled by API, but backup here)
        add_header 'Access-Control-Allow-Origin' 'https://${DOMAIN_STOREFRONT},https://${DOMAIN_ADMIN}' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' '3600' always;

        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            return 204;
        }

        # Increase timeout for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

    # Admin configuration (HTTPS)
    log "Creating HTTPS Nginx configuration for admin..."
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
    ssl_ciphers ${SSL_CIPHERS};
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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

    # Test configuration
    if nginx -t; then
        log "Nginx HTTPS configuration valid"
    else
        log_error "Nginx HTTPS configuration test failed"
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
    if ! certbot certonly --nginx -d "${DOMAIN_STOREFRONT}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}"; then
        log_error "Failed to obtain SSL certificate for ${DOMAIN_STOREFRONT}"
        log_error "SSL setup is FATAL. Cannot proceed without valid certificates."
        exit 1
    fi

    log "Obtaining SSL certificate for ${DOMAIN_API}..."
    if ! certbot certonly --nginx -d "${DOMAIN_API}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}"; then
        log_error "Failed to obtain SSL certificate for ${DOMAIN_API}"
        log_error "SSL setup is FATAL. Cannot proceed without valid certificates."
        exit 1
    fi

    log "Obtaining SSL certificate for ${DOMAIN_ADMIN}..."
    if ! certbot certonly --nginx -d "${DOMAIN_ADMIN}" --non-interactive --agree-tos --email "${EMAIL_ADMIN}"; then
        log_error "Failed to obtain SSL certificate for ${DOMAIN_ADMIN}"
        log_error "SSL setup is FATAL. Cannot proceed without valid certificates."
        exit 1
    fi

    # Setup auto-renewal (idempotent)
    local cron_entry="0 0,12 * * * certbot renew --quiet"
    if ! crontab -l 2>/dev/null | grep -qF "certbot renew"; then
        (crontab -l 2>/dev/null || true; echo "$cron_entry") | crontab -
        log "SSL auto-renewal cron job installed"
    else
        log "SSL auto-renewal cron job already exists"
    fi

    log "SSL certificates configured successfully"
}

#############################################################################
# Database Setup
#############################################################################

setup_database() {
    log_step "Setting up Database"

    if ! cd "$INSTALL_DIR"; then
        log_error "Failed to change to directory: $INSTALL_DIR"
        exit 1
    fi

    # Start postgres and redis first
    docker-compose -f docker-compose.production.yml up -d postgres redis
    DOCKER_STARTED=true

    log "Waiting for PostgreSQL to be ready..."
    local max_wait=60
    local waited=0
    until docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U "${DB_USER}" > /dev/null 2>&1; do
        if [ $waited -ge $max_wait ]; then
            log_error "PostgreSQL failed to become ready within ${max_wait} seconds"
            exit 1
        fi
        sleep 2
        waited=$((waited + 2))
        log_info "Waiting for PostgreSQL... (${waited}s/${max_wait}s)"
    done

    log "PostgreSQL is ready!"

    # Verify database connection
    log "Verifying database connection..."
    if docker-compose -f docker-compose.production.yml exec -T postgres psql -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT version();" > /dev/null 2>&1; then
        log "✓ Database connection verified"
    else
        log_error "Failed to connect to database"
        exit 1
    fi

    log "Database setup complete"
}

#############################################################################
# Application Deployment
#############################################################################

deploy_application() {
    log_step "Deploying Application"

    if ! cd "$INSTALL_DIR"; then
        log_error "Failed to change to directory: $INSTALL_DIR"
        exit 1
    fi

    log "Building and starting all services..."
    docker-compose -f docker-compose.production.yml up -d --build

    log "Waiting for services to be healthy..."
    local max_wait=180
    local waited=0
    local all_healthy=false

    while [ $waited -lt $max_wait ]; do
        if docker-compose -f docker-compose.production.yml ps | grep -E "(unhealthy|restarting)" > /dev/null 2>&1; then
            log_info "Some services are still starting... (${waited}s/${max_wait}s)"
            sleep 10
            waited=$((waited + 10))
        else
            all_healthy=true
            break
        fi
    done

    if [ "$all_healthy" = false ]; then
        log_error "Services failed to become healthy within ${max_wait} seconds"
        log_error "Check logs with: docker-compose -f $INSTALL_DIR/docker-compose.production.yml logs"
        exit 1
    fi

    # Check health
    if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
        log "Application deployed successfully!"
    else
        log_error "Some services failed to start. Check logs with: docker-compose -f docker-compose.production.yml logs"
        exit 1
    fi
}

#############################################################################
# Systemd Service
#############################################################################

create_systemd_service() {
    log_step "Creating Systemd Service"

    (umask 077 && cat > /etc/systemd/system/vaultscope.service) <<EOF
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

    (umask 077 && cat > "$CONFIG_DIR/config.env") <<EOF
# VaultScope Configuration
# Generated: $(date)
# WARNING: This file contains sensitive credentials. Keep it secure.

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
AUTHENTIK_CLIENT_SECRET_ADMIN=${AUTHENTIK_CLIENT_SECRET_ADMIN}
AUTHENTIK_CLIENT_ID_STOREFRONT=${AUTHENTIK_CLIENT_ID_STOREFRONT}
AUTHENTIK_CLIENT_SECRET_STOREFRONT=${AUTHENTIK_CLIENT_SECRET_STOREFRONT}

INSTALL_DIR=${INSTALL_DIR}
BRANCH=${BRANCH}
EOF

    log "Configuration saved to $CONFIG_DIR/config.env (secure permissions: 600)"
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
    echo -e "${BOLD}Credentials saved in:${NC} ${CONFIG_DIR}/config.env (chmod 600)"
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
    echo -e "${BOLD}${GREEN}Security Notes:${NC}"
    echo -e "  - All secrets stored with secure permissions (600)"
    echo -e "  - SSL certificates auto-renew via cron"
    echo -e "  - Strong TLS 1.2+ cipher suites configured"
    echo -e "  - Security headers enabled (HSTS, X-Frame-Options, etc.)"
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
    # Initialize log file with secure permissions
    touch "$LOG_FILE"
    chmod 600 "$LOG_FILE"

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
║            Full Stack Installer v2.0 (Production)         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo

    # Pre-flight checks
    check_root
    check_os
    run_preflight_checks

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

    # Two-stage Nginx: HTTP first for Let's Encrypt
    configure_nginx_http_only
    systemctl reload nginx
    setup_ssl

    # Now upgrade to HTTPS
    configure_nginx_https
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
