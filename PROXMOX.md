# VaultScope on Proxmox VE

Complete guide for deploying VaultScope on Proxmox VE.

## 🚀 Quick Start (Automated)

### 1. Upload the Setup Script

On your **Windows machine**, upload the script to Proxmox:

```bash
# Option A: SCP from Windows
scp proxmox-setup.sh root@176.9.0.171:/root/

# Option B: Or copy-paste via Proxmox web console
```

### 2. Run the Setup Script

SSH into your Proxmox host:

```bash
ssh root@176.9.0.171
```

Then run:

```bash
cd /root
chmod +x proxmox-setup.sh
./proxmox-setup.sh 200 vaultscope
```

**Arguments:**
- `200` - VM ID (choose any available number)
- `vaultscope` - VM name

The script will:
1. ✅ Check available storage (auto-detects alternatives to local-lvm)
2. ✅ Download Debian 13 cloud image (automated install)
3. ✅ Create VM with 8GB RAM, 4 CPU cores, 30GB disk
4. ✅ Configure cloud-init (root password: `vaultscope`)
5. ✅ Start VM and get IP address
6. ✅ Show next steps

**Time:** ~5 minutes

### 3. Install VaultScope

Once the VM is ready, SSH into it:

```bash
# Get the IP from script output or:
qm guest cmd 200 network-get-interfaces | grep ip-address

# SSH into VM
ssh root@<VM_IP>

# Run VaultScope installer
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | bash
```

**Done!** VaultScope will be available at:
- Storefront: `https://<your-domain>`
- API: `https://api.<your-domain>`
- Admin: `https://admin.<your-domain>`

## 📋 Manual Setup (Step-by-Step)

If you prefer manual control:

### 1. Create VM via Proxmox Web UI

1. **Navigate to:** Datacenter → Node → Create VM
2. **General:**
   - VM ID: `200`
   - Name: `vaultscope`
3. **OS:**
   - ISO image: Debian 13 netinstall
   - Type: Linux
   - Version: 6.x - 2.6 Kernel
4. **System:**
   - SCSI Controller: VirtIO SCSI single
   - BIOS: Default (SeaBIOS)
   - QEMU Agent: ✅ Enabled
5. **Disks:**
   - Bus/Device: SCSI 0
   - Storage: local-lvm (or your storage)
   - Disk size: 30 GB
   - Discard: ✅ Enabled
6. **CPU:**
   - Cores: 4
   - Type: host
7. **Memory:**
   - Memory: 8192 MB (8 GB)
8. **Network:**
   - Bridge: vmbr0
   - Model: VirtIO (paravirtualized)

### 2. Install Debian 13

1. Start VM and open console
2. Select "Install" (not graphical)
3. Language: English
4. Location: United States (or your region)
5. Keyboard: American English
6. Hostname: `vaultscope`
7. Domain: (leave blank or use `local`)
8. Root password: Set a strong password
9. Partitioning: 
   - Guided - use entire disk
   - All files in one partition
10. Software selection:
    - ✅ SSH server
    - ✅ Standard system utilities
    - ❌ Desktop environment (uncheck)
11. Install GRUB: Yes, to `/dev/sda`
12. Finish installation and reboot

### 3. Post-Install Configuration

SSH into the VM:

```bash
ssh root@<VM_IP>
```

Update system:

```bash
apt update && apt upgrade -y
apt install -y curl wget git qemu-guest-agent
systemctl enable --now qemu-guest-agent
```

### 4. Run VaultScope Installer

```bash
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | bash
```

## 🔧 Your Proxmox Host Specs

Based on your fastfetch output:

```yaml
Host: Proxmox VE 9.2.10
CPU: AMD Ryzen 5 3600 (12 cores) @ 4.21 GHz
RAM: 62.72 GiB total (34 GiB free)
Network: vmbr0 (176.9.0.171/27)
```

**You can easily run:**
- ✅ 4+ VaultScope VMs simultaneously
- ✅ Full production testing environment
- ✅ Development + staging + production VMs

## 📊 Recommended VM Configurations

### Minimal (Testing)
```yaml
Cores: 2
RAM: 4GB
Disk: 20GB
Use case: Quick testing, single-user
```

### Recommended (Production)
```yaml
Cores: 4
RAM: 8GB
Disk: 30GB
Use case: Small production deployment
```

### Heavy (High Traffic)
```yaml
Cores: 8
RAM: 16GB
Disk: 50GB
Use case: Multiple users, high traffic
```

## 🛠️ Useful Proxmox Commands

### VM Management
```bash
# List all VMs
qm list

# VM status
qm status 200

# Start/Stop/Restart VM
qm start 200
qm stop 200
qm restart 200

# Open console
qm terminal 200

# Get VM IP
qm guest cmd 200 network-get-interfaces | grep ip-address

# Monitor VM
qm monitor 200
```

### Snapshots (for Testing)
```bash
# Take snapshot before installer
qm snapshot 200 before-installer --description "Clean Debian install"

# List snapshots
qm listsnapshot 200

# Restore snapshot
qm rollback 200 before-installer

# Delete snapshot
qm delsnapshot 200 before-installer
```

### Resource Monitoring
```bash
# VM resource usage
qm status 200 --verbose

# Live stats
watch -n 1 'qm status 200 --verbose'

# Host resources
pvesh get /nodes/$(hostname)/status

# Storage usage
pvesm status
```

### Networking
```bash
# Show VM network config
qm config 200 | grep net

# Add another network interface
qm set 200 --net1 virtio,bridge=vmbr0

# Set static IP (cloud-init)
qm set 200 --ipconfig0 ip=176.9.0.180/27,gw=176.9.0.161
```

### Backups
```bash
# Create backup
vzdump 200 --mode snapshot --compress zstd --storage local

# Restore backup
qmrestore /var/lib/vz/dump/vzdump-qemu-200-*.vma.zst 200
```

## 🔐 Firewall Configuration

If using Proxmox firewall:

```bash
# Enable firewall for VM
qm set 200 --firewall 1

# Allow HTTP/HTTPS
cat > /etc/pve/firewall/200.fw <<EOF
[RULES]
IN ACCEPT -p tcp -dport 80
IN ACCEPT -p tcp -dport 443
IN ACCEPT -p tcp -dport 22
EOF

# Reload firewall
pve-firewall restart
```

## 📝 DNS Configuration

### Option A: Use VM IP Directly (Testing)
```bash
# Access via IP
http://176.9.0.180
```

### Option B: Configure DNS Records (Production)

Point your domains to the VM IP:
```
vaultscope.example.com     A  176.9.0.180
api.vaultscope.example.com A  176.9.0.180
admin.vaultscope.example.com A  176.9.0.180
```

### Option C: Local DNS (Development)

Add to your Windows `C:\Windows\System32\drivers\etc\hosts`:
```
176.9.0.180  vaultscope.local
176.9.0.180  api.vaultscope.local
176.9.0.180  admin.vaultscope.local
```

## 🎯 Testing Workflow

### 1. Create Clean VM
```bash
./proxmox-setup.sh 200 vaultscope
```

### 2. Take Snapshot
```bash
qm snapshot 200 clean-debian
```

### 3. Test Installer
```bash
ssh root@<VM_IP>
curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | bash
```

### 4. If Something Breaks
```bash
# Restore to clean state
qm rollback 200 clean-debian
qm start 200

# Try again
```

### 5. Multiple Test Runs
```bash
# Clone VM for parallel testing
qm clone 200 201 --name vaultscope-test2

# Test different configurations simultaneously
```

## 🔄 Update Testing Workflow

### Test Updates Without Breaking Production

```bash
# Clone production VM
qm clone 200 201 --name vaultscope-staging

# Test update on clone
ssh root@<staging-vm-ip>
cd /opt/vaultscope
./update.sh

# If successful, update production
ssh root@<production-vm-ip>
cd /opt/vaultscope
./update.sh
```

## 🐛 Troubleshooting

### VM Won't Start
```bash
# Check logs
qm status 200
tail -f /var/log/syslog | grep "200"

# Check config
qm config 200

# Reset VM
qm reset 200
```

### Can't Get VM IP
```bash
# Check QEMU agent
qm agent 200 ping

# If not running, install in VM:
apt install qemu-guest-agent
systemctl enable --now qemu-guest-agent
```

### Network Issues
```bash
# Check bridge status on Proxmox host
ip addr show vmbr0
bridge link

# Check VM network config
qm config 200 | grep net

# Inside VM, check network
ip addr
ip route
ping 8.8.8.8
```

## 📚 Additional Resources

- [Proxmox VE Documentation](https://pve.proxmox.com/pve-docs/)
- [QEMU Guest Agent](https://pve.proxmox.com/wiki/Qemu-guest-agent)
- [Cloud-Init Support](https://pve.proxmox.com/wiki/Cloud-Init_Support)
- [VaultScope Documentation](./documentation/)

## 🆘 Support

For VaultScope-specific issues:
- GitHub: https://github.com/VaultScope/website/issues
- Email: support@vaultscope.de

For Proxmox issues:
- Forum: https://forum.proxmox.com/
- Wiki: https://pve.proxmox.com/wiki/
