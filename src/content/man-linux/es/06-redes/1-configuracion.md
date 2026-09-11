---
title: "6.1 Hardening del Servidor OpenSSH"
description: "Pila TCP/IP, iproute2, resolución DNS, certificados TLS y configuración blindada de SSH."
moduleNumber: "06"
moduleTitle: "Redes, DNS & Acceso Remoto SSH"
---

### 6.1 Hardening del Servidor OpenSSH

Directivas seguras en `/etc/ssh/sshd_config.d/99-hardening.conf`:

```apache
# Solo autenticación por clave pública Ed25519
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
