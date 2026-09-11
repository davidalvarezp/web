---
title: "6.1 OpenSSH Server Hardening"
description: "TCP/IP stack, iproute2, DNS resolution, TLS certificates, and hardened SSH configurations."
moduleNumber: "06"
moduleTitle: "Networking, DNS & Remote SSH Access"
---

### 6.1 OpenSSH Server Hardening

Robust directives for `/etc/ssh/sshd_config.d/99-hardening.conf`:

```apache
# Public key authentication only (Ed25519)
Port 2222
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowGroups sysadmins
```
