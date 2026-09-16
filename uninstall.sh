#!/usr/bin/env bash

#############################################################################
# VaultScope Uninstaller
#
# Safely removes VaultScope installation while preserving SSL certificates
#
# Usage:
#   sudo ./uninstall.sh
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

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
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

#############################################################################
# Main Uninstallation
#############################################################################

main() {
    clear

    echo -e "${BOLD}${CYAN}"
    cat <<'EOF'
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              VaultScope Uninstaller v1.0                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo

    check_root

    log_warn "This will completely remove VaultScope from your system."
    log_warn "The following will be removed:"
    echo "  - All Docker containers and volumes"
    echo "  - Application files in /opt/vaultscope"
    echo "  - Configuration files in /etc/vaultscope"
    echo "  - Nginx configurations"
    echo "  - Systemd service"
    echo "  - Certbot renewal cron job"
    echo
    log_warn "The following will be PRESERVED:"
    echo "  - SSL certificates in /etc/letsencrypt/"
    echo "  - Docker, Nginx, and Certbot installations"
    echo "  - Database backups (if you created any)"
    echo

    read -p "$(echo -e ${YELLOW}Continue with uninstall? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Uninstall cancelled by user"
        exit 0
    fi

    echo

    # Stop and remove Docker containers
    log_step "Stopping Docker Containers"
    if [ -f "$INSTALL_DIR/docker-compose.production.yml" ]; then
        cd "$INSTALL_DIR" || true
        if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
            log "Stopping all services..."
            docker-compose -f docker-compose.production.yml down -v 2>/dev/null || log_warn "Some containers may not have stopped cleanly"
            log "Containers and volumes removed"
        else
            log "No running containers found"
        fi
    else
        log "Docker Compose file not found, skipping container removal"
    fi

    # Stop and disable systemd service
    log_step "Removing Systemd Service"
    if systemctl is-active vaultscope.service &>/dev/null; then
        log "Stopping vaultscope service..."
        systemctl stop vaultscope.service 2>/dev/null || true
    fi

    if systemctl is-enabled vaultscope.service &>/dev/null; then
        log "Disabling vaultscope service..."
        systemctl disable vaultscope.service 2>/dev/null || true
    fi

    if [ -f /etc/systemd/system/vaultscope.service ]; then
        rm -f /etc/systemd/system/vaultscope.service
        systemctl daemon-reload
        log "Systemd service removed"
    else
        log "No systemd service found"
    fi

    # Remove Nginx configurations
    log_step "Removing Nginx Configurations"

    local domains_found=false
    if [ -f "$CONFIG_DIR/config.env" ]; then
        source "$CONFIG_DIR/config.env" 2>/dev/null || true

        for domain in "$DOMAIN_STOREFRONT" "$DOMAIN_API" "$DOMAIN_ADMIN"; do
            if [ -n "$domain" ]; then
                domains_found=true
                if [ -f "/etc/nginx/sites-enabled/$domain" ]; then
                    rm -f "/etc/nginx/sites-enabled/$domain"
                    log "Removed Nginx config for $domain (enabled)"
                fi
                if [ -f "/etc/nginx/sites-available/$domain" ]; then
                    rm -f "/etc/nginx/sites-available/$domain"
                    log "Removed Nginx config for $domain (available)"
                fi
            fi
        done
    fi

    if [ "$domains_found" = true ]; then
        log "Testing Nginx configuration..."
        if nginx -t 2>/dev/null; then
            systemctl reload nginx 2>/dev/null || log_warn "Could not reload Nginx"
            log "Nginx reloaded successfully"
        else
            log_warn "Nginx configuration test failed, skipping reload"
        fi
    else
        log "No domain configuration found, skipping Nginx cleanup"
    fi

    # Remove application files
    log_step "Removing Application Files"
    if [ -d "$INSTALL_DIR" ]; then
        log "Removing $INSTALL_DIR..."
        rm -rf "$INSTALL_DIR"
        log "Application files removed"
    else
        log "Install directory not found"
    fi

    # Remove configuration files
    log_step "Removing Configuration Files"
    if [ -d "$CONFIG_DIR" ]; then
        log "Removing $CONFIG_DIR..."
        rm -rf "$CONFIG_DIR"
        log "Configuration files removed"
    else
        log "Config directory not found"
    fi

    # Remove installation log
    if [ -f "/var/log/vaultscope-install.log" ]; then
        rm -f "/var/log/vaultscope-install.log"
        log "Installation log removed"
    fi

    # Remove certbot renewal cron job
    log_step "Removing Certbot Cron Job"
    if crontab -l 2>/dev/null | grep -q "certbot renew"; then
        log "Removing certbot renewal from cron..."
        (crontab -l 2>/dev/null | grep -v "certbot renew") | crontab - 2>/dev/null || true
        log "Certbot cron job removed"
    else
        log "No certbot cron job found"
    fi

    # Clean up unused Docker resources
    log_step "Cleaning Docker Resources"
    log "Pruning unused Docker images and networks..."
    docker system prune -f 2>/dev/null || log_warn "Could not prune Docker resources"

    # Summary
    echo
    log_step "Uninstallation Complete"
    echo
    echo -e "${GREEN}✓${NC} VaultScope has been uninstalled"
    echo
    echo -e "${BOLD}Preserved:${NC}"
    echo "  - SSL certificates in /etc/letsencrypt/"
    echo "  - Docker installation"
    echo "  - Nginx installation"
    echo "  - Certbot installation"
    echo
    echo -e "${BOLD}To completely remove everything:${NC}"
    echo "  sudo apt remove docker-ce docker-ce-cli containerd.io nginx certbot"
    echo "  sudo rm -rf /etc/letsencrypt"
    echo
    log "Thank you for using VaultScope!"
    echo
}

main "$@"
