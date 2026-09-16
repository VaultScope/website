# Running VaultScope in LXC (Alternative to VM)

⚠️ **Note**: This is for local development only. Use a VM for testing the production installer.

## LXC Configuration Required

```bash
# Create privileged LXC container (required for Docker)
lxc launch images:debian/13 vaultscope -c security.nesting=true -c security.privileged=true

# Enter container
lxc exec vaultscope -- bash

# Inside container: Enable overlay filesystem
echo 'lxc.apparmor.profile = unconfined' >> /etc/lxc/default.conf
echo 'lxc.cgroup.devices.allow = a' >> /etc/lxc/default.conf
echo 'lxc.cap.drop =' >> /etc/lxc/default.conf
```

## Issues You'll Face

1. **Nested containers** - Docker inside LXC is nested containerization
2. **Storage driver** - May need to use `vfs` instead of `overlay2` (slower)
3. **Systemd** - May have issues with systemd services
4. **AppArmor** - Need to disable AppArmor profiles
5. **Security** - Privileged LXC = less isolation

## Workarounds

```bash
# Force Docker to use vfs storage driver
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "storage-driver": "vfs"
}
EOF

# Disable AppArmor for Docker
aa-remove-unknown
```

## When to Use LXC

- ✅ **Local dev** - Native development (cargo run, npm run dev)
- ✅ **Resource constrained** - Host has limited RAM/CPU
- ✅ **Quick testing** - Fast startup/shutdown cycles
- ❌ **Production testing** - VM is much better
- ❌ **Installer testing** - Use VM to match production
