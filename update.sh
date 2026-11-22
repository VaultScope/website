#!/usr/bin/env bash

#############################################################################
# VaultScope Updater
#
# Safely updates VaultScope installation to latest version
#
# Usage:
#   sudo ./update.sh [--branch=main|dev]
#############################################################################

set -euo pipefail
umask 077

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

# Default branch (overridden by CLI flags, VAULTSCOPE_BRANCH, or saved config)
BRANCH="${VAULTSCOPE_BRANCH:-}"
BRANCH_FROM_CLI=false

compose_cmd() {
    if docker compose version &> /dev/null; then
        docker compose "$@"
    else
        docker-compose "$@"
    fi
}

read_config_value() {
    local key=$1
    local file=$2
    grep -E "^${key}=" "$file" 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r"'
}

validate_branch() {
    local branch=$1
    if [[ "$branch" =~ ^(dev|main|v[0-9]+\.[0-9]+\.[0-9]+([.-][a-zA-Z0-9._-]+)?)$ ]]; then
        return 0
    fi
    log_error "Invalid branch/tag: $branch (must be 'main', 'dev', or a release tag like 'v1.0.0')"
    exit 1
}

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
                BRANCH_FROM_CLI=true
                ;;
            --dev)
                BRANCH="dev"
                BRANCH_FROM_CLI=true
                ;;
            --main)
                BRANCH="main"
                BRANCH_FROM_CLI=true
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

    if [ -z "$BRANCH" ] && [ "$BRANCH_FROM_CLI" = false ]; then
        BRANCH=$(read_config_value "BRANCH" "$CONFIG_DIR/config.env")
    fi
    BRANCH="${BRANCH:-main}"
    validate_branch "$BRANCH"

    local db_user db_name
    db_user=$(read_config_value "DB_USER" "$CONFIG_DIR/config.env")
    db_name=$(read_config_value "DB_NAME" "$CONFIG_DIR/config.env")
    [[ "$db_user" =~ ^[a-zA-Z_][a-zA-Z0-9_]{0,62}$ ]] || db_user="vaultscope"
    [[ "$db_name" =~ ^[a-zA-Z_][a-zA-Z0-9_]{0,62}$ ]] || db_name="vaultscope"

    log_info "Updating to branch: ${BRANCH}"
    echo

    read -p "$(echo -e "${YELLOW}Continue with update? [y/N]: ${NC}")" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Update cancelled by user"
        exit 0
    fi

    echo

    # Backup current version and PostgreSQL database before stopping containers
    log_step "Creating Database & Code Backup"
    BACKUP_DIR="$INSTALL_DIR/backups"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    local install_parent install_base
    install_parent="$(dirname "$INSTALL_DIR")"
    install_base="$(basename "$INSTALL_DIR")"

    (umask 077 && mkdir -p "$BACKUP_DIR")

    cd "$INSTALL_DIR"
    log "Backing up PostgreSQL database ($db_name) to $BACKUP_DIR/$BACKUP_NAME-db.sql.gz..."
    if compose_cmd -f docker-compose.production.yml ps postgres 2>/dev/null | grep -q "Up"; then
        (umask 077 && compose_cmd -f docker-compose.production.yml exec -T postgres \
            pg_dump -U "$db_user" -d "$db_name" --clean --if-exists | gzip -9 > "$BACKUP_DIR/$BACKUP_NAME-db.sql.gz") || {
            log_error "Database backup failed! Aborting update to protect database."
            exit 1
        }
        chmod 600 "$BACKUP_DIR/$BACKUP_NAME-db.sql.gz" 2>/dev/null || true
        log "Database backup created at $BACKUP_DIR/$BACKUP_NAME-db.sql.gz"
    else
        log_warn "Postgres container is not currently running; starting it to take pre-update backup..."
        compose_cmd -f docker-compose.production.yml up -d postgres
        sleep 5
        (umask 077 && compose_cmd -f docker-compose.production.yml exec -T postgres \
            pg_dump -U "$db_user" -d "$db_name" --clean --if-exists | gzip -9 > "$BACKUP_DIR/$BACKUP_NAME-db.sql.gz") || {
            log_error "Database backup failed! Aborting update to protect database."
            exit 1
        }
        chmod 600 "$BACKUP_DIR/$BACKUP_NAME-db.sql.gz" 2>/dev/null || true
        log "Database backup created at $BACKUP_DIR/$BACKUP_NAME-db.sql.gz"
    fi

    # Stop services
    log_step "Stopping Services"
    log "Stopping VaultScope services..."
    systemctl stop vaultscope 2>/dev/null || log_warn "Could not stop vaultscope service"

    cd "$INSTALL_DIR"
    compose_cmd -f docker-compose.production.yml down 2>/dev/null || log_warn "Could not stop Docker services"
    log "Services stopped"

    log "Creating filesystem backup: $BACKUP_NAME"
    (umask 077 && tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
        --exclude="${install_base}/backups" \
        --exclude="*/node_modules" \
        --exclude="*/target" \
        -C "$install_parent" "$install_base" 2>/dev/null) || log_warn "Backup may be incomplete"
    chmod 600 "$BACKUP_DIR/$BACKUP_NAME.tar.gz" 2>/dev/null || true

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
        tar -xzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$install_parent" 2>/dev/null || log_error "Backup restore failed"
        log_error "System restored to previous state"
        exit 1
    fi

    # Run database migrations
    log_step "Running Database Migrations"
    cd "$INSTALL_DIR"

    log "Starting database..."
    compose_cmd -f docker-compose.production.yml up -d postgres redis

    sleep 5

    log "Running migrations..."
    compose_cmd -f docker-compose.production.yml exec -T postgres psql -U "$db_user" -d "$db_name" -c "SELECT version();" || {
        log_warn "Database connection failed, skipping migrations"
    }

    # Rebuild and restart services
    log_step "Rebuilding Services"
    cd "$INSTALL_DIR"

    log "Building Docker images (this may take 5-10 minutes)..."
    compose_cmd -f docker-compose.production.yml build --no-cache || {
        log_error "Build failed. Restoring from backup..."
        tar -xzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$install_parent" 2>/dev/null || log_error "Backup restore failed"
        systemctl start vaultscope
        exit 1
    }

    log "Starting services..."
    compose_cmd -f docker-compose.production.yml up -d || {
        log_error "Failed to start services. Check logs: docker compose -f $INSTALL_DIR/docker-compose.production.yml logs"
        exit 1
    }

    # Wait for services to be healthy
    log_step "Verifying Services"
    log "Waiting for services to become healthy..."

    local max_wait=60
    local waited=0
    local all_healthy=false

    while [ $waited -lt $max_wait ]; do
        if compose_cmd -f docker-compose.production.yml ps | grep -q "Up"; then
            all_healthy=true
            break
        fi

        sleep 5
        waited=$((waited + 5))
        log_info "Waiting... (${waited}s/${max_wait}s)"
    done

    if [ "$all_healthy" = true ]; then
        log "Services are healthy"
        compose_cmd -f docker-compose.production.yml ps
    else
        log_warn "Services may not be fully healthy. Check status manually."
        compose_cmd -f docker-compose.production.yml ps
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
    echo "  Storefront: https://$(read_config_value DOMAIN_STOREFRONT "$CONFIG_DIR/config.env")"
    echo "  API:        https://$(read_config_value DOMAIN_API "$CONFIG_DIR/config.env")/api/health"
    echo "  Admin:      https://$(read_config_value DOMAIN_ADMIN "$CONFIG_DIR/config.env")"
    echo
    log "View logs with: docker compose -f $INSTALL_DIR/docker-compose.production.yml logs -f"
    echo
}

main "$@"
