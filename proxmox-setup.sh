#!/usr/bin/env bash

#############################################################################
# VaultScope Proxmox VM Creator
#
# Creates a Debian 13 VM optimized for VaultScope deployment
#
# Usage:
#   bash proxmox-setup.sh [vm_id] [vm_name]
#
# Default VM ID: 200
# Default VM name: vaultscope
#############################################################################

set -euo pipefail

# Configuration
VM_ID="${1:-200}"
VM_NAME="${2:-vaultscope}"
VM_MEMORY=8192           # 8GB RAM
VM_CORES=4               # 4 CPU cores
VM_DISK_SIZE=30G         # 30GB disk
VM_STORAGE="local-lvm"   # Change if your storage is different
VM_BRIDGE="vmbr0"        # Network bridge
ISO_STORAGE="local"      # ISO storage location

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

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
        log_error "This script must be run as root"
        exit 1
    fi
}

check_vm_exists() {
    if qm status "$VM_ID" &>/dev/null; then
        log_error "VM ID $VM_ID already exists"
        log_error "Choose a different ID or destroy existing VM with: qm destroy $VM_ID"
        exit 1
    fi
}

detect_storage() {
    log "Detecting available storage..."

    # Check if local-lvm exists
    if ! pvesm status | grep -q "local-lvm"; then
        log_warn "local-lvm storage not found, checking alternatives..."

        # Find first available storage that supports disk images
        VM_STORAGE=$(pvesm status | awk 'NR>1 && $2=="dir" {print $1; exit}')

        if [ -z "$VM_STORAGE" ]; then
            log_error "No suitable storage found for VM disks"
            log_error "Available storage:"
            pvesm status
            exit 1
        fi

        log "Using storage: $VM_STORAGE"
    fi
}

download_cloud_image() {
    log_step "Downloading Debian 13 Cloud Image"

    local image_url="https://cloud.debian.org/images/cloud/trixie/latest/debian-13-generic-amd64.qcow2"
    local image_file="/tmp/debian-13-generic-amd64.qcow2"

    if [ -f "$image_file" ]; then
        log "Cloud image already downloaded"
    else
        log "Downloading Debian 13 cloud image..."
        wget -q --show-progress "$image_url" -O "$image_file" || {
            log_error "Failed to download cloud image"
            exit 1
        }
    fi

    echo "$image_file"
}

create_vm() {
    log_step "Creating VM $VM_ID ($VM_NAME)"

    log "Creating VM with specifications:"
    echo "  VM ID:      $VM_ID"
    echo "  Name:       $VM_NAME"
    echo "  Memory:     ${VM_MEMORY}MB (8GB)"
    echo "  CPU Cores:  $VM_CORES"
    echo "  Disk:       $VM_DISK_SIZE"
    echo "  Storage:    $VM_STORAGE"
    echo "  Network:    $VM_BRIDGE"
    echo

    # Create VM
    qm create "$VM_ID" \
        --name "$VM_NAME" \
        --memory "$VM_MEMORY" \
        --cores "$VM_CORES" \
        --cpu host \
        --net0 virtio,bridge="$VM_BRIDGE" \
        --ostype l26 \
        --agent enabled=1 \
        --bios seabios \
        --boot order=scsi0 \
        --scsihw virtio-scsi-single || {
        log_error "Failed to create VM"
        exit 1
    }

    log "VM $VM_ID created successfully"
}

import_cloud_image() {
    local image_file="$1"

    log_step "Importing Cloud Image to VM"

    log "Importing disk image..."
    qm importdisk "$VM_ID" "$image_file" "$VM_STORAGE" || {
        log_error "Failed to import disk image"
        qm destroy "$VM_ID"
        exit 1
    }

    # Attach imported disk
    log "Attaching disk to VM..."
    qm set "$VM_ID" --scsi0 "${VM_STORAGE}:vm-${VM_ID}-disk-0" || {
        log_error "Failed to attach disk"
        qm destroy "$VM_ID"
        exit 1
    }

    # Resize disk to desired size
    log "Resizing disk to $VM_DISK_SIZE..."
    qm disk resize "$VM_ID" scsi0 "$VM_DISK_SIZE" || {
        log_warn "Failed to resize disk, continuing..."
    }

    log "Disk configured successfully"
}

configure_cloud_init() {
    log_step "Configuring Cloud-Init"

    # Add cloud-init drive
    qm set "$VM_ID" --ide2 "${VM_STORAGE}:cloudinit" || {
        log_warn "Failed to add cloud-init drive, continuing..."
    }

    # Configure cloud-init
    log "Setting cloud-init defaults..."
    qm set "$VM_ID" \
        --ciuser root \
        --cipassword "vaultscope" \
        --ipconfig0 ip=dhcp \
        --searchdomain local \
        --nameserver 8.8.8.8 || {
        log_warn "Failed to configure cloud-init, continuing..."
    }

    # Add SSH key if available
    if [ -f ~/.ssh/id_rsa.pub ]; then
        log "Adding SSH public key..."
        qm set "$VM_ID" --sshkeys ~/.ssh/id_rsa.pub || {
            log_warn "Failed to add SSH key, continuing..."
        }
    fi

    log "Cloud-init configured (user: root, password: vaultscope)"
}

configure_vm_options() {
    log_step "Configuring VM Options"

    # Enable serial console
    qm set "$VM_ID" --serial0 socket || log_warn "Failed to enable serial console"

    # Set VGA to serial
    qm set "$VM_ID" --vga serial0 || log_warn "Failed to set VGA"

    # Enable QEMU guest agent
    qm set "$VM_ID" --agent enabled=1,fstrim_cloned_disks=1 || log_warn "Failed to enable guest agent"

    # Set startup order (optional)
    qm set "$VM_ID" --onboot 0 || log_warn "Failed to set onboot"

    log "VM options configured"
}

create_vm_traditional() {
    log_step "Creating Traditional VM (Manual Install)"

    log "Creating VM with specifications:"
    echo "  VM ID:      $VM_ID"
    echo "  Name:       $VM_NAME"
    echo "  Memory:     ${VM_MEMORY}MB (8GB)"
    echo "  CPU Cores:  $VM_CORES"
    echo "  Disk:       $VM_DISK_SIZE"
    echo "  Storage:    $VM_STORAGE"
    echo "  Network:    $VM_BRIDGE"
    echo

    # Create VM with empty disk
    qm create "$VM_ID" \
        --name "$VM_NAME" \
        --memory "$VM_MEMORY" \
        --cores "$VM_CORES" \
        --cpu host \
        --net0 virtio,bridge="$VM_BRIDGE" \
        --ostype l26 \
        --agent enabled=1 \
        --bios seabios \
        --scsihw virtio-scsi-single || {
        log_error "Failed to create VM"
        exit 1
    }

    # Create and attach disk
    log "Creating ${VM_DISK_SIZE} disk..."
    qm set "$VM_ID" --scsi0 "${VM_STORAGE}:${VM_DISK_SIZE}" || {
        log_error "Failed to create disk"
        qm destroy "$VM_ID"
        exit 1
    }

    log "VM $VM_ID created successfully"
    log_warn "You need to manually attach a Debian 13 ISO to install"
    log_warn "Run: qm set $VM_ID --ide2 ${ISO_STORAGE}:iso/debian-13-amd64-netinst.iso,media=cdrom"
}

start_vm() {
    log_step "Starting VM"

    log "Starting VM $VM_ID..."
    qm start "$VM_ID" || {
        log_error "Failed to start VM"
        exit 1
    }

    log "VM started successfully"

    # Wait for VM to boot
    log "Waiting for VM to boot (30s)..."
    sleep 30

    # Try to get IP
    log "Attempting to get VM IP address..."
    local max_attempts=10
    local attempt=0
    local vm_ip=""

    while [ $attempt -lt $max_attempts ]; do
        vm_ip=$(qm guest cmd "$VM_ID" network-get-interfaces 2>/dev/null | \
                grep -oP '"ip-address":"(?!127\.0\.0\.1)\K[0-9.]+' | head -1 || echo "")

        if [ -n "$vm_ip" ]; then
            break
        fi

        attempt=$((attempt + 1))
        sleep 3
    done

    if [ -n "$vm_ip" ]; then
        echo "$vm_ip"
    else
        echo ""
    fi
}

show_completion() {
    local vm_ip="$1"

    log_step "VM Setup Complete!"
    echo
    echo -e "${BOLD}VM Details:${NC}"
    echo "  VM ID:      $VM_ID"
    echo "  VM Name:    $VM_NAME"
    echo "  Memory:     8GB"
    echo "  CPU Cores:  4"
    echo "  Disk:       $VM_DISK_SIZE"

    if [ -n "$vm_ip" ]; then
        echo "  IP Address: $vm_ip"
    else
        echo "  IP Address: (checking...)"
    fi

    echo
    echo -e "${BOLD}Login Credentials:${NC}"
    echo "  Username:   root"
    echo "  Password:   vaultscope"
    echo
    echo -e "${BOLD}Next Steps:${NC}"

    if [ -n "$vm_ip" ]; then
        echo "  1. SSH into the VM:"
        echo "     ssh root@${vm_ip}"
        echo
        echo "  2. Run the VaultScope installer:"
        echo "     curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | bash"
    else
        echo "  1. Check VM IP address:"
        echo "     qm guest cmd $VM_ID network-get-interfaces"
        echo
        echo "  2. Open VM console:"
        echo "     qm terminal $VM_ID"
        echo
        echo "  3. Or use Proxmox web UI to access console"
    fi

    echo
    echo -e "${BOLD}Useful Commands:${NC}"
    echo "  View VM status:      qm status $VM_ID"
    echo "  Stop VM:             qm stop $VM_ID"
    echo "  Start VM:            qm start $VM_ID"
    echo "  Open console:        qm terminal $VM_ID"
    echo "  Destroy VM:          qm destroy $VM_ID"
    echo "  Take snapshot:       qm snapshot $VM_ID before-installer"
    echo "  Restore snapshot:    qm rollback $VM_ID before-installer"
    echo
}

#############################################################################
# Main
#############################################################################

main() {
    clear

    echo -e "${BOLD}${CYAN}"
    cat <<'EOF'
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          VaultScope Proxmox VM Creator v1.0                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo

    check_root
    check_vm_exists
    detect_storage

    # Ask user for installation method
    echo -e "${BOLD}Choose installation method:${NC}"
    echo "  1) Cloud-init image (automated, faster) - Recommended"
    echo "  2) Traditional ISO install (manual, more control)"
    echo
    read -p "Select [1/2] (default: 1): " -n 1 -r method
    echo
    echo

    method="${method:-1}"

    if [ "$method" = "1" ]; then
        # Cloud-init method
        local image_file
        image_file=$(download_cloud_image)
        create_vm
        import_cloud_image "$image_file"
        configure_cloud_init
        configure_vm_options

        local vm_ip
        vm_ip=$(start_vm)
        show_completion "$vm_ip"

    else
        # Traditional method
        create_vm_traditional
        show_completion ""

        echo
        log_warn "Manual installation required:"
        log_warn "1. Attach Debian ISO to VM"
        log_warn "2. Start VM and complete Debian installation"
        log_warn "3. After install, run VaultScope installer"
    fi
}

main "$@"
