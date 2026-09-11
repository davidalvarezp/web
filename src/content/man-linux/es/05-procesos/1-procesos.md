---
title: "5.1 Creación de Servicios Systemd Seguros"
description: "Señales POSIX, cgroups v2, unidades de Systemd personalizadas, timers y crontab."
moduleNumber: "05"
moduleTitle: "Procesos, Systemd & Automatización"
---

### 5.1 Creación de Servicios Systemd Seguros

Unidad con aislamiento de espacio de nombres y permisos mínimos:

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

# Hardening Systemd
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes
PrivateTmp=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```
