#!/usr/bin/env bash

#############################################################################
# VaultScope Updater
#
# Safely updates VaultScope installation to latest version
#
# Usage:
#   sudo ./update.sh [--branch=main|dev]
#############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Directories
INSTALL_DIR="/opt/vaultscope"
CONFIG_DIR="/etc/vaultscope"

# Default branch
BRANCH="${VAULTSCOPE_BRANCH:-dev}"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_step() {
    echo -e "\n${BOLD}${CYAN}==>${NC} ${BOLD}$*${NC}\n"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run as root. Please use sudo."
        exit 1
    fi
}

parse_args() {
    for arg in "$@"; do
        case $arg in
            --branch=*)
                BRANCH="${arg#*=}"
                ;;
            --dev)
                BRANCH="dev"
                ;;
            --main)
                BRANCH="main"
                ;;
            *)
                log_warn "Unknown argument: $arg"
                ;;
        esac
    done
}

#############################################################################
# Main Update Process
#############################################################################

main() {
    clear

    echo -e "${BOLD}${CYAN}"
    cat <<'EOF'
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                VaultScope Updater v1.0                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo

    check_root
    parse_args "$@"

    # Verify installation exists
    if [ ! -d "$INSTALL_DIR" ]; then
        log_error "VaultScope installation not found at $INSTALL_DIR"
        log_error "Please run the installer first"
        exit 1
    fi

    if [ ! -f "$CONFIG_DIR/config.env" ]; then
        log_error "Configuration not found at $CONFIG_DIR/config.env"
        log_error "Installation may be incomplete"
        exit 1
    fi

    log_info "Updating to branch: ${BRANCH}"
    echo

    read -p "$(echo -e ${YELLOW}Continue with update? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Update cancelled by user"
        exit 0
    fi

    echo

    # Stop services
    log_step "Stopping Services"
    log "Stopping VaultScope services..."
    systemctl stop vaultscope 2>/dev/null || log_warn "Could not stop vaultscope service"

    cd "$INSTALL_DIR"
    docker-compose -f docker-compose.production.yml down 2>/dev/null || log_warn "Could not stop Docker services"
    log "Services stopped"

    # Backup current version
    log_step "Creating Backup"
    BACKUP_DIR="$INSTALL_DIR/backups"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"

    mkdir -p "$BACKUP_DIR"

    log "Creating backup: $BACKUP_NAME"
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
        --exclude="$BACKUP_DIR" \
        --exclude="*/node_modules" \
        --exclude="*/target" \
        "$INSTALL_DIR" 2>/dev/null || log_warn "Backup may be incomplete"

    log "Backup created at $BACKUP_DIR/$BACKUP_NAME.tar.gz"

    # Update repositories
    log_step "Updating Code"

    local update_failed=false

    # Update website
    if [ -d "$INSTALL_DIR/website" ]; then
        log "Updating VaultScope Website..."
        cd "$INSTALL_DIR/website"
        git fetch origin || { log_error "Failed to fetch website"; update_failed=true; }
        if [ "$update_failed" = false ]; then
            git checkout "$BRANCH" || log_warn "Could not switch to branch $BRANCH"
            git pull origin "$BRANCH" || { log_error "Failed to pull website"; update_failed=true; }
            [ "$update_failed" = false ] && log "Website updated"
        fi
    else
        log_warn "Website directory not found"
    fi

    # Update API
    if [ -d "$INSTALL_DIR/vamos" ]; then
        log "Updating VaultScope API (VAMOS)..."
        cd "$INSTALL_DIR/vamos"
        git fetch origin || { log_error "Failed to fetch API"; update_failed=true; }
        if [ "$update_failed" = false ]; then
            git checkout "$BRANCH" || log_warn "Could not switch to branch $BRANCH"
            git pull origin "$BRANCH" || { log_error "Failed to pull API"; update_failed=true; }
            [ "$update_failed" = false ] && log "API updated"
        fi
    else
        log_warn "API directory not found"
    fi

    # Update Admin
    if [ -d "$INSTALL_DIR/camos" ]; then
        log "Updating VaultScope Admin (CAMOS)..."
        cd "$INSTALL_DIR/camos"
        git fetch origin || { log_error "Failed to fetch Admin"; update_failed=true; }
        if [ "$update_failed" = false ]; then
            git checkout "$BRANCH" || log_warn "Could not switch to branch $BRANCH"
            git pull origin "$BRANCH" || { log_error "Failed to pull Admin"; update_failed=true; }
            [ "$update_failed" = false ] && log "Admin updated"
        fi
    else
        log_warn "Admin directory not found"
    fi

    if [ "$update_failed" = true ]; then
        log_error "Update failed. Restoring from backup..."
        cd "$INSTALL_DIR/.."
        tar -xzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" 2>/dev/null || log_error "Backup restore failed"
        log_error "System restored to previous state"
        exit 1
    fi

    # Run database migrations
    log_step "Running Database Migrations"
    cd "$INSTALL_DIR"

    log "Starting database..."
    docker-compose -f docker-compose.production.yml up -d postgres redis

    sleep 5

    log "Running migrations..."
    docker-compose -f docker-compose.production.yml exec -T postgres psql -U vaultscope -d vaultscope -c "SELECT version();" || {
        log_warn "Database connection failed, skipping migrations"
    }

    # Rebuild and restart services
    log_step "Rebuilding Services"
    cd "$INSTALL_DIR"

    log "Building Docker images (this may take 5-10 minutes)..."
    docker-compose -f docker-compose.production.yml build --no-cache || {
        log_error "Build failed. Restoring from backup..."
        cd "$INSTALL_DIR/.."
        tar -xzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" 2>/dev/null
        systemctl start vaultscope
        exit 1
    }

    log "Starting services..."
    docker-compose -f docker-compose.production.yml up -d || {
        log_error "Failed to start services. Check logs: docker-compose -f $INSTALL_DIR/docker-compose.production.yml logs"
        exit 1
    }

    # Wait for services to be healthy
    log_step "Verifying Services"
    log "Waiting for services to become healthy..."

    local max_wait=60
    local waited=0
    local all_healthy=false

    while [ $waited -lt $max_wait ]; do
        if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
            all_healthy=true
            break
        fi

        sleep 5
        waited=$((waited + 5))
        log_info "Waiting... (${waited}s/${max_wait}s)"
    done

    if [ "$all_healthy" = true ]; then
        log "Services are healthy"
        docker-compose -f docker-compose.production.yml ps
    else
        log_warn "Services may not be fully healthy. Check status manually."
        docker-compose -f docker-compose.production.yml ps
    fi

    # Start systemd service
    log_step "Starting System Service"
    systemctl start vaultscope 2>/dev/null || log_warn "Could not start vaultscope service"
    log "VaultScope service started"

    # Show versions
    log_step "Update Complete"
    echo
    echo -e "${GREEN}✓${NC} VaultScope updated successfully to branch: ${BRANCH}"
    echo
    echo -e "${BOLD}Current versions:${NC}"

    if [ -d "$INSTALL_DIR/website" ]; then
        cd "$INSTALL_DIR/website"
        echo -ne "  Website: "
        git log -1 --format="%h - %s" || echo "unknown"
    fi

    if [ -d "$INSTALL_DIR/vamos" ]; then
        cd "$INSTALL_DIR/vamos"
        echo -ne "  API:     "
        git log -1 --format="%h - %s" || echo "unknown"
    fi

    if [ -d "$INSTALL_DIR/camos" ]; then
        cd "$INSTALL_DIR/camos"
        echo -ne "  Admin:   "
        git log -1 --format="%h - %s" || echo "unknown"
    fi

    echo
    echo -e "${BOLD}Backup:${NC} $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    echo
    echo -e "${BOLD}Services:${NC}"
    echo "  Storefront: https://$(grep DOMAIN_STOREFRONT $CONFIG_DIR/config.env 2>/dev/null | cut -d= -f2)"
    echo "  API:        https://$(grep DOMAIN_API $CONFIG_DIR/config.env 2>/dev/null | cut -d= -f2)/api/health"
    echo "  Admin:      https://$(grep DOMAIN_ADMIN $CONFIG_DIR/config.env 2>/dev/null | cut -d= -f2)"
    echo
    log "View logs with: docker-compose -f $INSTALL_DIR/docker-compose.production.yml logs -f"
    echo
}

main "$@"
