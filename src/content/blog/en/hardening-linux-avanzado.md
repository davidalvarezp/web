---
title: "Advanced Linux Hardening Guide for SysAdmins"
description: "Production-ready guide for hardening Linux servers: SSH, kernel sysctl, filesystems, networking, systemd, and auditd event logging."
date: 2026-06-26
author: "David Álvarez (dap)"
tags: ["Linux","Hardening","CyberSec","SSH","Systemd"]
readTimeMinutes: 14
---

## Introduction

Hardening is not a static checklist you apply once and forget. It is an ongoing discipline of attack surface reduction, process isolation, and auditability. In this guide from **dap.gal**, I summarize the configurations applied across both my production clusters and homelab environment.

---

## 1. Kernel Hardening via `/etc/sysctl.d/99-hardening.conf`

The Linux kernel exposes hundreds of tunable network and memory variables. We apply these directives to mitigate IP spoofing, buffer exhaustion, and unprivileged memory inspection:

```ini
# Strict Reverse Path Filtering (prevents IP spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Disable ICMP redirect processing (mitigates MITM)
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# SYN Flood mitigation
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096

# Restrict dmesg output to root
kernel.dmesg_restrict = 1

# Hide kernel memory pointers from unprivileged users
kernel.kptr_restrict = 2

# Disable unprivileged eBPF execution
kernel.unprivileged_bpf_disabled = 1
```

Activate changes instantly:
```bash
sudo sysctl --system
```

---

## 2. Hardening OpenSSH Server

OpenSSH is your perimeter's initial gatekeeper. Modify `/etc/ssh/sshd_config.d/hardening.conf`:

```apache
# Modern cryptographic ciphers & key exchange
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com

# Prohibit root & password authentication
PermitRootLogin no
PasswordAuthentication no
AuthenticationMethods publickey
MaxAuthTries 3
X11Forwarding no
```

---

## 3. Continuous Audit Logging with Auditd

Track identity modifications and privilege escalation syscalls in real time:

```bash
# Audit any write access to authentication databases
auditctl -w /etc/passwd -p wa -k identity_changes
auditctl -w /etc/shadow -p wa -k identity_changes
auditctl -w /etc/sudoers -p wa -k priv_escalation
```

Every event will be permanently stamped in `/var/log/audit/audit.log` with exact process attribution.
