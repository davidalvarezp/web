---
title: "Guía Avanzada de Hardening en Linux para SysAdmins"
description: "Guía práctica de hardening de servidores Linux en producción: SSH, kernel sysctl, filesystem, red, systemd y auditoría con auditd."
date: 2026-06-26
author: "David Álvarez (dap)"
tags: ["Linux","Hardening","CyberSec","SSH","Systemd"]
readTimeMinutes: 14
---

## Introducción

El hardening no es un checklist estático que se aplica una vez y se olvida. Es una disciplina continua de reducción de superficie de ataque, aislamiento de procesos y observabilidad. En esta guía documentada en **dap.gal**, recopilo las configuraciones que aplico tanto en mi homelab como en servidores de producción.

---

## 1. Securización del Kernel vía `/etc/sysctl.d/99-hardening.conf`

El kernel de Linux expone cientos de parámetros configurables. Aplicamos estas directivas para mitigar ataques de spoofing de red, desbordamientos de buffer y accesos indebidos a memoria:

```ini
# Protección contra Spoofing IP (Reverse Path Filtering)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Deshabilitar redirecciones ICMP (previene ataques MITM)
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# Mitigación de SYN Flood
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096

# Restringir dmesg solo al usuario root
kernel.dmesg_restrict = 1

# Ocultar punteros del kernel a usuarios sin privilegios
kernel.kptr_restrict = 2

# Deshabilitar carga automática de protocolos de red legacy (DCCP, SCTP)
kernel.unprivileged_bpf_disabled = 1
```

Aplica los cambios inmediatamente con:
```bash
sudo sysctl --system
```

---

## 2. Hardening del Servidor SSH

El servicio OpenSSH es la primera línea de defensa. Editamos `/etc/ssh/sshd_config.d/hardening.conf`:

```apache
# Solo claves Ed25519 y RSA >= 4096 bits
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com

# Prohibir autenticación por contraseña y root
PermitRootLogin no
PasswordAuthentication no
AuthenticationMethods publickey
MaxAuthTries 3
X11Forwarding no
```

---

## 3. Auditoría de Eventos con Auditd

Monitorizamos intentos de ejecución y modificaciones a archivos críticos del sistema en tiempo real:

```bash
# Auditar cualquier modificación a los ficheros de contraseñas
auditctl -w /etc/passwd -p wa -k identity_changes
auditctl -w /etc/shadow -p wa -k identity_changes
auditctl -w /etc/sudoers -p wa -k priv_escalation
```

Con estas reglas activas, cualquier anomalía queda registrada en `/var/log/audit/audit.log` con atribución exacta de UID y PID.
