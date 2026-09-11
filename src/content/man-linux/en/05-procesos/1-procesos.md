---
title: "5.1 Hardened Systemd Service Units"
description: "POSIX signals, cgroups v2, custom Systemd units, timers, and cron jobs."
moduleNumber: "05"
moduleTitle: "Processes, Systemd & Automation"
---

### 5.1 Hardened Systemd Service Units

Unit with sandbox namespaces and least-privilege constraints:

```ini
[Unit]
Description=API Backend Service
After=network.target

[Service]
Type=exec
User=appuser
Group=appuser
WorkingDirectory=/opt/app
ExecStart=/opt/app/bin/server
Restart=on-failure
RestartSec=5s

# Systemd Hardening
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes
PrivateTmp=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```
